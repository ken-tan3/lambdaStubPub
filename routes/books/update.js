'use strict';

require('date-utils');

module.exports = function (req, res) {
  let nowFormatted = new Date().toFormat("YYYY-MM-DD HH24:MM:SS");
  const jsonParsedData = req.body

  // validation
  // 必須項目
  if (jsonParsedData.updateDate == null || jsonParsedData.bookId == null) {
    res.status(404).json({
      errorCode: 'E10202',
      errorMessage: 'リクエストパラメータ不正：必須項目',
    })
    return;
  }
  // 型
  if (typeof jsonParsedData.bookId !== 'string' || typeof jsonParsedData.bookContentId !== 'string' || typeof jsonParsedData.bookFolderId !== 'string' || typeof jsonParsedData.bookCode !== 'string' || typeof jsonParsedData.updateDate !== 'string') {
    res.status(404).json({
      errorCode: 'E10211',
      errorMessage: 'リクエストパラメータ不正：型がstringではない',
    })
    return;
  }

  const params = {
    TableName: "BookFolder",
    Item: {
      bookId: jsonParsedData.bookId,
      bookContentId: jsonParsedData.bookContentId,
      bookFolderId: jsonParsedData.bookFolderId,
      bookCode: jsonParsedData.bookCode,
      updateDate: nowFormatted,
    },
  };

  // レスポンス
  res.json({ data: params.Item })
  console.log(res);

}