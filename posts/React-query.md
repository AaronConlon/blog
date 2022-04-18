---
title: 'React-query'
date: '2022/4/19'
tags:
- React
- React-query
mainImg: 'https://images.unsplash.com/photo-1599837565318-67429bde7162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTAyOTgwNTU&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1599837565318-67429bde7162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTAyOTgwNTU&ixlib=rb-1.2.1&q=80&w=400'
intro: 'React-query is a awesome library for fetching data in react application.'
---

I hope to use simple examples to record everything about react-query.

Thank you! [React Query Tutorial - 1 - Introduction - YouTube](https://www.youtube.com/watch?v=VtWkSCZX0Ec&list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2&index=1)

Content of table:

- Fetching data with useQuery
- Handleing query error
- Devtools
- Query cache
- Stable time
- Refetch defaults
- Polling data
- Click event and useQuery
- Success and error callbacks
- Data Ttransformation
- Custon query hook
- Query by Id
- Parallel queries
- Dynamic parallel query
- Dependent queries
- Infinite query data
- Pagination queires
- Inifite queries
- Mutations
- Query invalidation
- Handing mutation response
- Optimistic updates
- Axios Interceptor



## Fetching data with useQuery

Let's create a query:

 ```jsx
 const fetchTodos = async () => {
   return axios.get("https://localhost:4000/todos")
 }
 // give a unique identify key and a fetch function
 const response = useQeury('todo-list', fetchTodos);
 ```

> `todo-list` is a unique key to identify your query, fetchTodos is your fetch function.

Now,we get a response object.It's contains:

- isLoading: web request loading status
- data: response data
- more...

## Handling query error

Again.

```jsx
const fetchTodos = async () => {
  return axios.get("https://localhost:4000/todossss")
}
const {isLoading, data, isError, error} = useQuery('todo-list', fetchTodos);
```

Ok,We got a `error` message and a status:"`isError`"!

Why?Beacuse my request url is wrong.It was a 404 page.

You can display the `error` message in your app.

