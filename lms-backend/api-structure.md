# API Structure 

## scalar result 

```json
## success
{
    data: any
}

## error
{
    message: string
   
}
```

## Pagination result 

```json
## success
{
    data: [
        any
    ],
    pageNumber :number,
    pageCount :number,
    totalItems :number,
    totalPages :number,
    hasPrevPage :boolean,
    hasNextPage :boolean,
    prevPage :number,
    nextPage :number
}

## error
{
    message: string
    
}
```