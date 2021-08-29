'use strict';

require('date-utils');

module.exports = function (req, res) {

  const jsonParsedData = req.body

  // validation
  // 必須項目
  if (jsonParsedData.bookId == null || jsonParsedData.bookCode == null) {
    res.status(404).json({
      errorCode: 'E10202',
      errorMessage: 'リクエストパラメータ不正：必須項目',
    })
    return;
  }
  // 型
  if (typeof jsonParsedData.bookId !== 'string' || typeof jsonParsedData.bookCode !== 'string') {
    res.status(404).json({
      errorCode: 'E10211',
      errorMessage: 'リクエストパラメータ不正：型がstringではない',
    })
    return;
  }

  const params = {
    TableName: "Book",
    Item: {
      bookId: jsonParsedData.bookId,
    },
  };


  // レスポンス
  res.json({ data: params.Item })
  console.log(res);

}