/* globals newTodo */
document.addEventListener("DOMContentLoaded", function () {
  newTodo.addEventListener("keyup", function (e) {
    if (e.key !== "Enter") return;
    document.body.state.todos.push({ label: newTodo.value, completed: false });
    newTodo.value = "";
  });
});
