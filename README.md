## Reducer

Reducers xác định trạng thái ứng dụng thay đổi như thế nào để đáp ứng với các actions được gửi đến store.
Lưu ý nhưng hành động này chỉ mô tả những gì xảy ra, nhưng không mô tả cách trạng thái trạng thái ứng dụng thay đổi.

---

### Thiết kế State shape

Trong Redux tất cả các trạng thái ứng dụng được lưu như một single object. Chúng ta nên nghĩ về đối tượng trước khi viết code. Để biểu diễn trạng thái ứng dụng cần tối thiểu những đối tượng gì ?

Với ứng dụng todo app, chúng ta muốn lưu 2 thứ:

- Bộ lọc hiện tại là gì
- Danh sách thực tế các công việc

Bạn sẽ thường tìm thấy rằng bạn cần lưu dữ liệu, cũng như trạng thái UI trong cây trạng thái. Điều này là tốt những hãy cố gắng giữ cho dữ liệu tách biệt khỏi trạng thái của UI

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

> ##### Lưu ý cho Relationships
>
> [updating]

---

### Handling Actions

Bây giờ sau khi đã quyết định đối tượng của trạng thái như thế nào thì sau đó chúng ta sẽ bắt đầu viết `reducer` cho nó.
Reducer là một `pure function` (dịch là hàm thuần túy) có đầu vào là trạng thái trước đó và action, đầu ra sẽ là trạng thái tiếp theo.

```
(previousState, action) => newState
```

Nó được gọi là reducer bởi vì đó là loại hàm bạn cần chuyển đến (dịch hơi rối).

Ví dụ

```
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

<img align="center" width="500" src="https://useyourloaf.com/assets/images/2016/Reduce.png">

Một số điều bạn không bao giờ được làm bên trong reducer

- Thay đổi tham số của nó
- Gọi api hay chuyển route.
- Gọi non-pure function Vd `Date.now()`, `Math.random()`

### Store

Trong phần trước chúng ta đã định nghĩa `actions` mô tả những gì sẽ xảy ra, và `reducers` để cập nhật trạng thái theo những hành động đó.

`Store` là một đối tượng sẽ kết hợp `actions` và `reducers` lại với nhau. `Store` sẽ có những nhiệm vụ sau:

- Giữ trạng thái thái của ứng dụng.
- Cho phép truy cập vào trạng thái thông qua hàm `getState()`;
- Cho phép cập nhật trạng thái thông qua hàm `dispatch(action)`
- Đăng ký lắng nghe sự kiện thông qua hàm `subscrible(listener)`
- Xử lý hủy đăng ký lắng nghe sự kiện thông qua kết quả trả về của hàm `subscible(listener)`

Điều quan trọng mà bạn cần lưu ý đây là chỉ có duy nhất 1 `Store` trong ứng dụng với Redux. Khi bạn muốn tách hay phân chia logic xử lý dữ liệu, bạn sẽ dùng [reducer composition](https://redux.js.org/basics/reducers#splitting-reducers) thay cho nhiều store.

Rất dễ để tạo `store` khi chúng ta đã có `reducer`. Trong phần trước chúng ta dùng `combineReducers()` để gộp nhiều `reducer` vào một. Bây giờ chúng ta sẽ import nó và chuyển nó qua `createStore`

```js
import { createStore } from 'redux'
import todoApp from './reducers'
const store = createStore(todoApp)
```

Bạn có thể tùy chọn khác với trạng thái khởi tạo như một tham số thứ 2 của `createStore`.

```js
const store = createStore(todoApp, window.STATE_FROM_SERVER)
```

### Dispatching Actions

Bây giờ chúng ta đã tạo xong `store`

## Data flow

Kiến trúc của Redux xoay quanh luồng dữ liệu một chiều chặt chẽ.

Có nghĩa rằng tất cả dữ liệu trong ứng dụng đều tuân thủ cùng một lifecycle pattern, điều này làm cho logic ứng dụng của bạn dễ dự đoán hơn và dễ dàng để hiểu hơn.

Data lifecycle của bất kỳ ứng dụng sử dụng Redux đều phải tuân thủ 4 bước:

1. Gọi `store.dispatch(action)`
   `action` là một đối tượng đơn giản(plain object) môt tả những gì đã xảy ra.

```js
 { type: 'LIKE_ARTICLE', articleId: 42 }
 { type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } }
 { type: 'ADD_TODO', text: 'Read the Redux docs.' }
```

2. Redux store gọi reducer mà bạn đã khai báo

3. Root reducer có thể gộp nhiều output reducers vào một cây trạng thái đơn(single state tree)

4. Redux store lưu cây trạng thái(state tree) hoàn chỉnh được trả về bởi root reducer

## Presentational and Container Components

Để dùng `connect`, bạn cần định nghĩa một hàm đặc biệt được gọi là `mapStateToProps` hàm này làm nhiệm vụ thay đổi trạng thái hiện tại của Redux store thành thuộc tính bạn mong muốn để sử dụng cho `presentation component`.
Ví dụ, `VisibleTodoList` cần tính toán `todos` để truyền vào `TodoList`, vậy chúng ta định nghĩa hàm filter `state.todos` theo `state.visibilityFilter`, và sử dụng trong `mapStateToProps`

```js
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    case 'SHOW_ALL':
    default:
      return todos
  }
}

const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```

Ngoài việc đọc trạng thái, các `container components` còn có thể dispatch actions. Tương tự như trên, bạn có thể định nghĩa thêm một hàn gọi là `mapDispatchToProps()` nó sẽ nhận phương thức `dispatch()` và trả về `props` bạn muốn thêm vào trong `presentational components`. Ví dụ chúng ta muốn `VisibleTodoList` truyền thuộc tính tên là `onTodoClick` vào `TodoList` component, và chúng ta muốn `onTodoClick` dispatch `TOGGLE_TODO` actions:

```js
const mapDispatchToProps = dispatch = {
  return {
  onTodoClick: id => {
   dispatch(toggleTodo(id))
  }
 }
}
```

Cuối cùng, chúng ta tạo `VisibleTodoList` bằng cách gọi `connect()` và truyền hai hàm này:

```js
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
export default VisibleTodoList
```

##### Tham khảo:

- useyourloaf.com
