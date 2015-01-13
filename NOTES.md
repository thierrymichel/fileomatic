# MisterQ | Notes

## Routing

|URL                    |method  |params           |query           |body                |controller|info                          |
|-----------------------|--------|-----------------|----------------|--------------------|----------|------------------------------|
|/                      |GET     |                 |                |                    |home      |homepage                      |
|/groups                |POST    |                 |                |pseudo, groupId     |groups    |join group                    |
|/groups/:id            |GET     |idGroup          |                |                    |groups    |display group                 |
|/groups/:id            |POST    |idGroup          |_method=DELETE  |                    |groups    |leave group                   |
|/groups/:id/users/:id  |POST    |idGroup, idUser  |                |                    |users     |start pending                 |
|/groups/:id/users/:id  |POST    |idGroup, idUser  |_method=DELETE  |                    |users     |start watching                |
|/groups/:id/users/:id  |POST    |idGroup, idUser  |                |isAdmin (session?)  |users     |start serving                 |
|/groups/:id/users/:id  |POST    |idGroup, idUser  |_method=DELETE  |isAdmin (session?)  |users     |start watching (idem noAdmin) |
|/admin                 |GET     |                 |                |                    |admin     |redirect /admin/groups        |
|/admin/groups          |GET     |                 |                |                    |admin     |list groups                   |
|/admin/groups          |POST    |                 |                |name, description   |admin     |create group                  |
|/admin/groups/:id      |POST    |idGroup          |_method=DELETE  |                    |admin     |delete group                  |


## Code

```
#{formatZero(5)}
#{formatStamp(server.joinedAt)}
```
