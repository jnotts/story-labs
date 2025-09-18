
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="glass-panel p-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Welcome to Story Labs!</h1>
            <p className="text-muted-foreground">
              Check your email to confirm your account
            </p>
            <p className="text-sm opacity-70">
              We've sent a confirmation link to your email. Click it to activate your account and start creating stories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
