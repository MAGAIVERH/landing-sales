export const Footer = () => {
  return (
    <footer className='border-t py-10'>
      <div className='mx-auto max-w-6xl px-6 text-sm text-muted-foreground'>
        © {new Date().getFullYear()} MacGyver Platforms. Todos os direitos
        reservados.
      </div>
    </footer>
  );
};
