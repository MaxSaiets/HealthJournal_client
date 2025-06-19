import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Navigate, useLocation } from "react-router-dom";
import { WELCOME_ROUTE } from "../../consts/routePaths";

const RequireAuth = ({children}: {children: React.ReactNode}) => {
    const { user } = useSelector((state: RootState) => state.user);
    const location = useLocation();

    if (!user) {
        return <Navigate to={WELCOME_ROUTE} state={{from: location}} replace />
    }

    return children;
}

export default RequireAuth;