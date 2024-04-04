import React from 'react'

const SignUp = () => {
    return (
        <>
            <div>SignUp</div>
            <form>
                <input type="text" id="username" placeholder="Username" />
                <input type="email" id="email" placeholder="Email" />
                <input type="password" id="password" placeholder="Password" />
                <button>Sign Up</button>
            </form>
        </>
    )
}

export default SignUp