if(process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw/sw.js').then(function(reg) {

      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }

    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }
}



