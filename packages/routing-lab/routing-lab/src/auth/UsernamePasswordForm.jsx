import { useActionState } from "react";

export function UsernamePasswordForm() {
    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const username = formData.get("username");
            const password = formData.get("password");

            if (!username || !password) {
                return {
                type: "error",
                message: `Please fill in your username and password.`,
                };
            }

            console.log("username: ", username)
            console.log("pass: ", password)

            //   await fakeSendEmail();

            return {
            type: "success",
            message: `You have succesfully subscribed!`,
            };
        },
        null
    );
    return(<>
    <form action={submitAction}>
        <label htmlFor="">
            Username
            <input id="username" name="username" type="text" />
        </label>
        <label htmlFor="">
            Password
            <input id="password" name="password" type="password" />
        </label>
        <button type="submit">submit</button>
    </form>
    {result?.type === "error" && (
    <p style={{ color: "red", marginTop: "10px" }}>
        {result.message}
    </p>
    )}
    </>)
}


const fakeSendEmail = async () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const NewsletterSubscribe = () => {
  return (
    <>
      {result && <p className={`message ${result.type}`}>{result.message}</p>}
      {isPending && <p className="message loading">Loading ...</p>}
      <form action={submitAction}>
        <h3>Join the newsletter</h3>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" disabled={isPending} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" disabled={isPending}/>
        </div>
        <div>
          <button type="submit" disabled={isPending}>Subscribe</button>
        </div>
      </form>
    </>
  );
};

export default NewsletterSubscribe;