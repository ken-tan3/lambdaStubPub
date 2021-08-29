## 環境
```
$ node -v  
v15.2.0  
$ aws --v  
aws-cli/1.18.69 Python/3.8.5 Linux/5.4.72-microsoft-standard-WSL2 botocore/1.16.19  
$ sls -v  
Framework Core: 2.47.0  
Plugin: 5.4.0  
SDK: 4.2.3  
Components: 3.12.0  
```


#### 参考資料
Serverless Frameworkの基礎情報
[Serverless Frameworkの使い方まとめ](https://serverless.co.jp/blog/25/)


## serverless frameworkでAWSにデプロイするためのawscliの初期設定
```
$ aws configure  
AWS Access Key ID [None]: sample  
AWS Secret Access Key [None]: sample  
Default region name [None]: ap-northeast-1  
Default output format [None]: json  
```


## node_modulesのインストール
```
$ cd lambdaLayer/nodejs
$ npm i  
```


## serverless frameworkのデプロイ
※注1
```
$ sls deploy  
```


## curlでAPIを呼び出す

#### GETのAPI

- リクエストパラメータを付けた場合(string)
正常に返却される。
```
$ curl -i -X GET https://xxx.amazonaws.com/dev/api/v1/books/?bookCode="sample"
HTTP/2 200 
content-type: application/json; charset=utf-8
中略
{"data":{"bookFolderId":"111111","bookFolderName":"folderSample","bookCode":"sample","updateDate":"2021-06-25 11:06:27"}}
```
- リクエストパラメータを付けた場合(integer)
string型に変換され、返却される。
```
$ curl -i -X GET https://xxx.amazonaws.com/dev/api/v1/books/?bookCode=1111111 
HTTP/2 200 
content-type: application/json; charset=utf-8
中略
{"data":{"bookFolderId":"111111","bookFolderName":"folderSample","bookCode":"1111111","updateDate":"2021-06-25 11:06:13"}}
```
- リクエストパラメータを付けない場合
エラーが返却される。
```
$ curl -i -X GET https://xxx.amazonaws.com/dev/api/v1/books/
HTTP/2 404 
content-type: application/json; charset=utf-8
中略
{"errorCode":"E10202","errorMessage":"リクエストパラメータ不正：必須項目"}
```

- 複数リクエストパラメータ使用時
サンプル
```
$ curl -i -X GET https://xxx.amazonaws.com/dev/api/v1/code-master/?mainCode=sample\&secondaryCode=sample1\&codeValue=sample2

HTTP/2 200 
content-type: application/json; charset=utf-8
中略
{"data":{"codeValue":"sample2","secondaryCode":"sample1","minorCode":"111","codeCategoryName":"test","codeName":"testname","detail1":"detail1","detail2":"detail2","detail3":"detail3"}}
```
#### 参考文献
[cURLコマンドで「クエリ文字列が在るURL」を扱うときはURLを囲もう](https://dev.classmethod.jp/articles/curl-command-url-tips/)

#### POST/PUT/DELETEのAPI

- jsonをそのまま書いてリクエストパラメータを渡した場合 
```
$ curl -i -X DELETE https://xxx.amazonaws.com/dev/api/v1/books -d '{"bookFolderId":"111111"}' -H "Content-Type: application/json"
HTTP/2 200 
content-type: application/json; charset=utf-8
中略
{"data":{"bookFolderId":"111111"}}
```  
- json位置を絶対パスで指定してリクエストパラメータを渡した場合 
```
$ curl -i -X DELETE https://xxx.amazonaws.com/dev/api/v1/books -d @/絶対パス/sampleJsons/books/delete.json -H "Content-Type: application/json"
HTTP/2 200 
content-type: application/json; charset=utf-8
中略
{"data":{"bookFolderId":"111111"}}
```

- リクエストパラメータを渡さない場合  
```
$ curl -i -X DELETE https://xxx.amazonaws.com/dev/api/v1/books -H "Content-Type: application/json"
HTTP/2 404 
content-type: application/json; charset=utf-8
中略
{"errorCode":"E10202","errorMessage":"リクエストパラメータ不正：必須項目"}
```


## Lambda内でexpressを動かすために、@vendia/serverless-expressを導入する
#### expressの導入理由 
- すべてのエンドポイントを1つのLambdaへルーティングさせ、エンドポイントの管理を簡単にするため。
- 1つのLambdaで管理するため。

#### ライブラリ選定理由
同様のライブラリと比較しても、ダウンロード数やgithubのスター数が多いため。  
[aws-serverless-express vs serverless-http](https://www.npmtrends.com/aws-serverless-express-vs-serverless-http)

#### 参考文献
[serverless-expressでAPI GatewayからLambdaを実行する](https://zenn.dev/yuta_saito/articles/8b543a1957c375593ee5)


## 注1：特にコマンドを打つ必要はないが、serverless.ymlを書く際の注意事項
node_modulesをLambda Layerに登録する際、layersの名前とserviceの名前が一致していると、公式ドキュメントの書き方ではLambda Layerに正しくデータが送信されない。正しくデータを送信するには公式ドキュメントの[AWS - Layers:Using your layers](https://www.serverless.com/framework/docs/providers/aws/guide/layers/#using-your-layers)にある下記の箇所を修正するか、もしくはlayersの名前とserviceの名前を違う名前で記載する必要がある。今回は、layersの名前とserviceの名前を変更することで解決した。
- 誤
```
layers:
  test:
    path: layer
functions:
  hello:
    handler: handler.hello
    layers:
      - { Ref: TestLambdaLayer }
```
- 正
```
layers:
  Test:
    path: layer
functions:
  hello:
    handler: handler.hello3
    layers:
      - { Ref: TestLambdaLayer }
```
上記の問題はServerless Frameworkのフォーラムにも記載した。  
https://forum.serverless.com/t/aws-lambda-layers-node-modules-not-working/7914/4
https://forum.serverless.com/t/lambda-layers-node-require-the-layer-code-sls-invoke-local/6673/20


## おまけ：ローカルでのLambdaの開発に便利なServerless-Dev-Toolsを試す
serverless-Dev-Tools: ローカルでlambdaの状況を観察するツール  
インストールと試し方 (ローカル無理ならグローバル-g でインストール)  
```
$ npm i -D sls-dev-tools  
$ sls-dev-tools  
```

#### 参考文献
[ローカルでのLambdaの開発に便利なServerless-Dev-Toolsを試す](https://serverless.co.jp/blog/150/)