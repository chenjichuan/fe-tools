import moment from 'moment'

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
    if (item.product_time) {
      if ((moment(item.product_time).unix() >= moment().unix())) {
        item.product_time += ' 未上线'
      } else {
        item.product_time += ' 已上线'
      }
    }
    item.description = item.description.replace(/\n/g, ' ')
  })
  // delete data['projec_id'];
  // delete data['projec_id'];
  exporter({
    filename: '周报',
    columns: columns,
    data: data
  })
}
