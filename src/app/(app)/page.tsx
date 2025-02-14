import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-xl">Welcome to <i className=" text-3xl">Matrix </i> <strong className=" text-xl">HRM</strong> </p>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Login To Get Started
          </li>
          <li>And try out the features that were listed in the task</li>
          <li>use following credentials to test:
            <ul className="pl-6"><li>You can use either username or email</li></ul>
            <ul className="pl-6">
              <li>Username: Romus Shrestha</li>
              <li>Email: test@gmail.com</li>
              <li>Password: test1234</li>
            </ul>
          </li>
          <li>For other user credentials is respective username and password are same for all user</li>
        </ol>
      </main>

    </div>
  );
}
