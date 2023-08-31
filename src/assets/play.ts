import type { Context, Config} from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {

    let r = 'oi'

    return new Response(r);
};

export const config: Config = {
    path: "/play",
  };
  