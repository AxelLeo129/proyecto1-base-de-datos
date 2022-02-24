# Proyecto 1
Base de datos 1 sección 20  
Autores:
- Axel López 20768
- Luis González 20008  
  
## Pre requisitos  
Node < 14.x  *Probado en version 14.17.3   
NPM < 6.x  *Probado en version 6.14.13  


## Iniciar proyecto
>instalar dependencias
```
npm install  
```
>iniciar servidor
```
npm run start
```  

## Uso de API
>endpoint
```
POST /upload-file  
```
>BODY JSON
```
{
    "file": "file", 
    "host": "localhost", 
    "user": "postgres", 
    "database": "nba", 
    "password": "123", 
    "port": 5432,
    "table": "Players",
    "fields": "id, name, description, created_at"
}
```