import { useActionState } from "react";


export function UsernamePasswordForm({onSubmit}) {
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

            //   await fakeSendEmail();
            const submitResult = await onSubmit({username, password})
            return submitResult;
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
