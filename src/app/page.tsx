import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Главная страница</h1>
      <Link href="/login">Войти в систему</Link>
    </div>
  );
}