'use strict';

require('date-utils');

module.exports = function (req, res) {
  let nowFormatted = new Date().toFormat("YYYY-MM-DD HH24:MM:SS");
  const query = req.query

  // validation
  // 必須項目
  if (query.bookCode == null) {
    res.status(404).json({
      errorCode: 'E10202',
      errorMessage: 'リクエストパラメータ不正：必須項目',
    })
    return;
  }
  // 型
  if (typeof query.bookCode !== 'string') {
    res.status(404).json({
      errorCode: 'E10211',
      errorMessage: 'リクエストパラメータ不正：型がstringではない',
    })
    return;
  }

  const params = {
    TableName: "Bookmark",
    Item: [{
      bookmarkContentId: "111111",
      bookmarkFolderId: "222222",
      bookmarkId: "333333",
      bookCode: query.bookCode,
      updateDate: nowFormatted,
    }, {
      bookmarkContentId: "111111",
      bookmarkFolderId: "222222",
      bookmarkId: "333333",
      bookCode: query.bookCode,
      updateDate: nowFormatted,
    }]
  };

  // レスポンス
  res.json({ data: params.Item })
  console.log(res);

}