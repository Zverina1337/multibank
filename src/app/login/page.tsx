export default function LoginPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Вход в систему</h1>
      <form>
        <div>
          <label>Номер телефона: </label>
          <input type="phone" name="phone" />
        </div>
        <div>
          <label>Пароль: </label>
          <input type="password" name="password" />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}