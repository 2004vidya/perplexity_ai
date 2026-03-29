import { useDispatch } from "react-redux";

import { register, login, getMe } from "../service/auth.api";
import { setuser, setLoading, setError } from "../auth.slice";

export function useAuth() {
  let dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch = useDispatch();
      const data = await register({ email, username, password });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Registration failed"),
      );
    } finally {
      dispatch(setLoading(false));
    }
}
    async function handleLogin({ email, password }) {
      try {
        dispatch(setLoading(true));
        const data = await login({ email, password });
        dispatch(setuser(data.user));
      } catch (error) {
        dispatch(setError(error.response?.data?.message || "Login failed"));
      } finally {
        dispatch(setLoading(false));
      }
    }
    async function handleGetMe() {
      try {
        dispatch(setLoading(true));
        const data = await getMe();
        dispatch(setuser(data.user));
      } catch (error) {
        dispatch(
          setError(error.response?.data?.message || "Failed to fetch user"),
        );
      } finally {
        dispatch(setLoading(false));
      }
    }
    return {
      handleRegister,
      handleLogin,
      handleGetMe,
    };
  }

