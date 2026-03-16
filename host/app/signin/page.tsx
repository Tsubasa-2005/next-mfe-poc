"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { env } from "../../env";
import { createHostAuthClient } from "../../lib/auth-client";

const authServerOrigin = env.NEXT_PUBLIC_AUTH_SERVER_ORIGIN;

export default function SignInPage() {
  const authClient = useMemo(() => createHostAuthClient(authServerOrigin), []);
  const { data, error, isPending: isSessionPending } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isSignUp) {
        await authClient.signUp.email(
          {
            email,
            password,
            name: name.trim(),
          },
          {
            onSuccess: () => {
              window.location.replace("/?view=host");
            },
            onError: (ctx) => {
              if (ctx.error.status === 422) {
                setErrorMessage("このメールアドレスは既に使用されています");
                return;
              }

              setErrorMessage(ctx.error.message || "アカウント作成に失敗しました");
            },
          }
        );
      } else {
        await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onSuccess: () => {
              window.location.replace("/?view=host");
            },
            onError: (ctx) => {
              if (ctx.error.status === 401 || ctx.error.message?.includes("Invalid")) {
                setErrorMessage("メールアドレスまたはパスワードが間違っています");
                return;
              }

              setErrorMessage(ctx.error.message || "サインインに失敗しました");
            },
          }
        );
      }
    } catch {
      setErrorMessage("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    setErrorMessage("");

    try {
      const signOutResult = await authClient.signOut();

      if (signOutResult.error) {
        setErrorMessage(signOutResult.error.message ?? "サインアウトに失敗しました");
        return;
      }

      window.location.replace("/?view=host");
    } catch {
      setErrorMessage("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8">
        <section className="w-full rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Sign in</h1>
              <p className="mt-1 text-sm text-slate-500">better-auth の email/password 認証</p>
            </div>
            <Link
              href="/?view=host"
              className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              Back to host
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
              {data?.session ? (
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">サインイン済み</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {data.user.email} で認証されています。
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSignOut}
                    className="inline-flex w-fit items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "処理中..." : "サインアウト"}
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {isSignUp ? "アカウント作成" : "サインイン"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      better-auth の email/password 認証を使用します。
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="grid gap-4">
                    {isSignUp ? (
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-700">
                          名前
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                          placeholder="山田 太郎"
                          required
                        />
                      </div>
                    ) : null}

                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        メールアドレス
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                        placeholder="name@example.com"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="password" className="text-sm font-medium text-slate-700">
                        パスワード
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                        required
                      />
                    </div>

                    {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

                    <button
                      type="submit"
                      disabled={loading || isSessionPending}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "処理中..." : isSignUp ? "アカウント作成" : "サインイン"}
                    </button>
                  </form>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setIsSignUp((current) => !current);
                      setErrorMessage("");
                    }}
                    className="w-fit text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSignUp
                      ? "すでにアカウントをお持ちの方はこちら"
                      : "アカウントをお持ちでない方はこちら"}
                  </button>
                </div>
              )}

              {error ? <p className="mt-4 text-sm text-rose-600">{error.message}</p> : null}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
