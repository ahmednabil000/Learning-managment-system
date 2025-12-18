# API Structure 

## scalar result 

```json
## success
{
    status: "success",
    data: any
}

## error
{
    status: "error",
    message: string
}
```

## Pagination result 

```json
## success
{
    status: "success",
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
    status: "error",
    message: string
}
```