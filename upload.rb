upload_cmd = "aws lambda update-function-code --zip-file fileb://#{`pwd`.chomp}/alexaplm.zip --function-name AlexaPLM"

`zip -r alexaplm.zip node_modules index.js`
`#{upload_cmd}`
