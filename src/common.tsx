import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import querystring from "querystring";
import { accessTokenClient } from "./dataProvider";

export const LoadingDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div>加载中{dots}</div>;
};

export const FailDots = () => {
  return <div>加载失败</div>;
};

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const useGetInfo = (
  resource: string,
  params: any
): {
  data: any | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let url = "/api/" + resource + "?" + querystring.stringify(params);
  useEffect(() => {
    accessTokenClient(url)
      .then(({ json }) => {
        setData(json);
        setIsLoading(false);
      })
      .catch((reason) => {
        setError(reason);
        setIsLoading(false);
      });
  }, [url]);
  return { data, isLoading, error };
};
