import { Link, useRouteError } from "react-router-dom";
import React, { type ReactElement } from "react";

export default function ErrorPage(): ReactElement {
    const error: any = useRouteError()
    console.error(error)

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{(Boolean(error.statusText)) || error.message}</i>
            </p>
            <Link to={'/'}>回到首页</Link>
        </div>
    )
}
