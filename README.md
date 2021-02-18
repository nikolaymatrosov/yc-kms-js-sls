### Установим зависимости

```shell
npm i -g serverless
npm i
```
Еще нам понадобится `yc` CLI. Инструкция по установке и настройке [тут](https://cloud.yandex.ru/docs/cli/quickstart).

### Подготовим секрет.

Для наглядности в качестве секрета и для простоты валидации возьмем обычную фразу и запишем ее в файл `plaintext.txt`.
```shell
echo 'The quick brown fox jumps over the lazy dog' > plaintext.txt
```

Теперь создадим ключ в KMS при помощи `yc` CLI. 

```shell
yc kms symmetric-key create \
  --name kms-demo \
  --default-algorithm aes-256 \
  --rotation-period 24h 
```

При помощи `yc` и только что созданного ключа мы можем зашифровать наш `plaintext.txt`.
Зашифрованный текст положим в файл `ciphertext.txt`

```shell
yc kms symmetric-crypto encrypt \
  --name kms-demo \
  --plaintext-file plaintext.txt \
  --ciphertext-file ciphertext.txt
```

Теперь запишем id ключа и шифротекст в файл `.env`, чтобы использовать в serverless.

```shell
yc kms symmetric-key get --name=kms-demo --format=json | jq -r '"KEY_ID=\(.id)"' > .env
echo "CIPHERTEXT=$(base64 -i ciphertext.txt)" >> .env
```

### Раздеплоим функцию.

```shell
sls deploy
```

### Теперь можно проверить
```shell
sls invoke -f env-demo
```

И в консоли мы увидим следующее:

```
Serverless: {"statusCode":200,"body":"The quick brown fox jumps over the lazy dog\n"}
```
