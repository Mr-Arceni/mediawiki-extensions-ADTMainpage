# ADTMainpage Mediawiki расширение
Небольшое расширение оформления сделанное специально для Adventure Time Wiki проекта Space Station 14.

Данное расширение требует скин [Citizen](https://github.com/StarCitizenTools/mediawiki-skins-Citizen) версии старше 2.40.2 и [MediaWiki](https://github.com/wikimedia/mediawiki) версии 1.41.0 и старше

## Разработка
Локальная вики из репозитория готова к сборке и запуску на Docker
```bash
docker-compose up -d
```
Учётная запись локальной вики

- Логин: `Adt-admin-login`
- Пароль: `Adt-admin-password`

### Тесты
В репозитории настроены nodejs `stylelint` и `eslint`
```bash
npm install eslint stylelint stylelint-config-wikimedia
npx stylelint "src/resources/**/*.css"
npx eslint "src/resources/**/*.js"
```