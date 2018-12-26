
var cacheStorageKeyHtml = 'minimal-pwa-Html';
var cacheStorageKeyJs = 'minimal-pwa-Js';
var cacheStorageKeyImg = 'minimal-pwa-Img';
var cacheStorageKeyOther = 'minimal-pwa-Oh';
var cacheStorageKeyApi = 'minimal-pwa-Api';
var cacheStorageKey = [cacheStorageKeyHtml, cacheStorageKeyJs, cacheStorageKeyImg, cacheStorageKeyOther, cacheStorageKeyApi];
var htmlArr = [
  '/',
  '/home',
  '/login',
]
var jsArr = []
var imgArr = []
var otherArr = []
cacheList.forEach((item) => {
  if(/png|jpg|svg/.test(item)) {
    imgArr.push(item)
  } else if(/woff|ttf/.test(item)) {
    otherArr.push(item)
  } else if (/\.js/.test(item)) {
    jsArr.push(item)
  }
})
// 当浏览器解析完sw文件时，serviceworker内部触发install事件

// 当浏览器解析完sw文件时，serviceworker内部触发install事件
self.addEventListener('install', function(e) {
  console.log('Cache event!')
  // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
  e.waitUntil(
    caches.open(cacheStorageKeyHtml).then(function(cache) {
      return cache.addAll(htmlArr)
    })
  )
  e.waitUntil(
    caches.open(cacheStorageKeyJs).then(function(cache) {
      return cache.addAll(jsArr)
    })
  )
  e.waitUntil(
    caches.open(cacheStorageKeyImg).then(function(cache) {
      return cache.addAll(imgArr)
    })
  )
  e.waitUntil(
    caches.open(cacheStorageKeyOther).then(function(cache) {
      return cache.addAll(otherArr)
    })
  )
})

// 如果当前浏览器没有激活的service worker或者已经激活的worker被解雇，
// 新的service worker进入active事件
self.addEventListener('activate', function(e) {
  console.log('Activate event');
  // active事件中通常做一些过期资源释放的工作
  var cacheDeletePromises = caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(name => {
      if (cacheStorageKey.indexOf(name)) { // 如果资源的key与当前需要缓存的key不同则释放资源
        console.log('caches.delete', caches.delete);
        var deletePromise = caches.delete(name);
        console.log('cache delete result: ', deletePromise);
        return deletePromise;
      } else {
        return Promise.resolve();
      }
    }));
  });

  console.log('cacheDeletePromises: ', cacheDeletePromises);
  e.waitUntil(
    Promise.all([cacheDeletePromises]
    ).then(() => {
      console.log('Clients claims.')
      return self.clients.claim();
    })
  )
})


self.addEventListener('fetch', function(e) {
  e.respondWith( // 该策略先从网络中获取资源，如果获取失败则再从缓存中读取资源
    fetch(e.request.url)
      .then(function (httpRes) {

        // 请求失败了，直接返回失败的结果
        if (!httpRes || httpRes.status !== 200) {
          // return httpRes;
          return caches.match(e.request)
        }

        // 请求成功的话，将请求缓存起来。
        var responseClone = httpRes.clone();
        caches.open(cacheStorageKeyApi).then(function (cache) {
          return cache.delete(e.request)
            .then(function() {
              cache.put(e.request, responseClone);
            });
        });

        return httpRes;
      })
      .catch(function(err) { // 无网络情况下从缓存中读取
        console.error(err);
        return caches.match(e.request);
      })
  )
})
