interface AuthProps {
  children: React.ReactNode,
}

function AuthLayout({children}: AuthProps) {
  return (
    <div className="flex justify-center pt-20">
      {children}
    </div>
  );
}

export default AuthLayout;