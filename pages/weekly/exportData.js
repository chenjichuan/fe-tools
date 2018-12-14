// import { exportCsv } from '@/libs/util';

export const exportData = (title, data, ownerKey, exporter) => {
  const columns = [];
  title.forEach(item => {
    if (item.key === 'project_id') {
      item.key = 'project_name';
    }
    if (ownerKey === item.key) {
      item.key = 'owner';
      columns.push({
        "title": '进度',
        "key": 'percent',
        "width": 500,
        "sortable": true
      })
    }
    columns.push({
      "title": item.label,
      "key": item.key,
      "width": 500,
      "sortable": true
    })
  })

  data.forEach(item => {
    delete item['project_id'];
    item.simulation_range = item.simulation_range.join(' - ');
    item.date_range = item.date_range.join(' - ');
    item.percent = (item.percent || 0) + '%';
  })
  // delete data['projec_id'];
  // delete data['projec_id'];
  exporter({
    filename: '前端项目周报',
    columns: columns,
    data: data
  })
  console.log(columns);
  console.log(data);
  // console.log(data);
}
