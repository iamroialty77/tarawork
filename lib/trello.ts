const TRELLO_API_BASE = "https://api.trello.com/1";

export class TrelloApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.name = "TrelloApiError";
    this.status = status;
    this.details = details;
  }
}

type TrelloRequestConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  query?: Record<string, string | undefined>;
  credentials?: TrelloCredentials;
};

export type CreateTrelloCardInput = {
  idList: string;
  name: string;
  description?: string;
  due?: string;
  idMembers?: string[];
  idLabels?: string[];
};

export type CreateTrelloBoardInput = {
  name: string;
  description?: string;
  permissionLevel?: "private" | "org" | "public";
  defaultLists?: boolean;
  defaultLabels?: boolean;
};

export type UpdateTrelloCardInput = {
  idCard: string;
  name?: string;
  description?: string;
  due?: string;
  idList?: string;
  closed?: boolean;
  idMembers?: string[];
  idLabels?: string[];
};

export type TrelloCredentials = {
  key: string;
  token: string;
};

export function getEnvTrelloCredentials(): TrelloCredentials {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;

  if (!key || !token) {
    throw new Error("Trello API credentials are not configured.");
  }

  return { key, token };
}

function toCsv(items?: string[]) {
  if (!items || items.length === 0) {
    return undefined;
  }

  const cleaned = items.map((item) => item.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned.join(",") : undefined;
}

async function trelloRequest<T>({
  method = "GET",
  path,
  query = {},
  credentials,
}: TrelloRequestConfig): Promise<T> {
  const { key, token } = credentials ?? getEnvTrelloCredentials();
  const url = new URL(`${TRELLO_API_BASE}${path}`);

  url.searchParams.set("key", key);
  url.searchParams.set("token", token);

  for (const [queryKey, value] of Object.entries(query)) {
    if (typeof value === "string" && value.length > 0) {
      url.searchParams.set(queryKey, value);
    }
  }

  const response = await fetch(url.toString(), { method });
  const responseText = await response.text();
  let payload: unknown = null;

  if (responseText) {
    try {
      payload = JSON.parse(responseText) as unknown;
    } catch {
      payload = { message: responseText };
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as Record<string, unknown>).message === "string"
        ? ((payload as Record<string, unknown>).message as string)
        : "Trello request failed.";

    throw new TrelloApiError(message, response.status, payload);
  }

  return payload as T;
}

export async function getTrelloBoards(credentials?: TrelloCredentials) {
  return trelloRequest<
    Array<{
      id: string;
      name: string;
      url: string;
      closed: boolean;
    }>
  >({
    path: "/members/me/boards",
    credentials,
    query: {
      fields: "id,name,url,closed",
      filter: "open",
    },
  });
}

export async function createTrelloBoard(input: CreateTrelloBoardInput, credentials?: TrelloCredentials) {
  return trelloRequest<{
    id: string;
    name: string;
    url: string;
    desc: string;
    closed: boolean;
  }>({
    method: "POST",
    path: "/boards",
    credentials,
    query: {
      name: input.name,
      desc: input.description,
      prefs_permissionLevel: input.permissionLevel || "private",
      defaultLists: typeof input.defaultLists === "boolean" ? String(input.defaultLists) : "true",
      defaultLabels: typeof input.defaultLabels === "boolean" ? String(input.defaultLabels) : "true",
    },
  });
}

export async function getTrelloBoardLists(idBoard: string, credentials?: TrelloCredentials) {
  return trelloRequest<
    Array<{
      id: string;
      name: string;
      closed: boolean;
      idBoard: string;
      pos: number;
    }>
  >({
    path: `/boards/${idBoard}/lists`,
    credentials,
    query: {
      fields: "id,name,closed,idBoard,pos",
      filter: "open",
    },
  });
}

export async function createTrelloCard(input: CreateTrelloCardInput, credentials?: TrelloCredentials) {
  return trelloRequest<{
    id: string;
    name: string;
    url: string;
    idList: string;
  }>({
    method: "POST",
    path: "/cards",
    credentials,
    query: {
      idList: input.idList,
      name: input.name,
      desc: input.description,
      due: input.due,
      idMembers: toCsv(input.idMembers),
      idLabels: toCsv(input.idLabels),
    },
  });
}

export async function getTrelloMember(credentials: TrelloCredentials) {
  return trelloRequest<{
    id: string;
    username: string;
    fullName: string;
    url: string;
  }>({
    path: "/members/me",
    credentials,
    query: {
      fields: "id,username,fullName,url",
    },
  });
}

export async function updateTrelloCard(input: UpdateTrelloCardInput, credentials?: TrelloCredentials) {
  return trelloRequest<{
    id: string;
    name: string;
    url: string;
    idList: string;
    closed: boolean;
  }>({
    method: "PUT",
    path: `/cards/${input.idCard}`,
    credentials,
    query: {
      name: input.name,
      desc: input.description,
      due: input.due,
      idList: input.idList,
      closed: typeof input.closed === "boolean" ? String(input.closed) : undefined,
      idMembers: toCsv(input.idMembers),
      idLabels: toCsv(input.idLabels),
    },
  });
}

export async function addCommentToTrelloCard(
  idCard: string,
  text: string,
  credentials?: TrelloCredentials,
) {
  return trelloRequest<{
    id: string;
    type: string;
    date: string;
  }>({
    method: "POST",
    path: `/cards/${idCard}/actions/comments`,
    credentials,
    query: {
      text,
    },
  });
}

export async function addAttachmentToTrelloCard(
  {
    idCard,
    url,
    name,
    setCover,
  }: { idCard: string; url: string; name?: string; setCover?: boolean },
  credentials?: TrelloCredentials,
) {
  return trelloRequest<{
    id: string;
    name: string;
    url: string;
  }>({
    method: "POST",
    path: `/cards/${idCard}/attachments`,
    credentials,
    query: {
      url,
      name,
      setCover: typeof setCover === "boolean" ? String(setCover) : undefined,
    },
  });
}

export async function listTrelloWebhooks(credentials: TrelloCredentials) {
  return trelloRequest<
    Array<{
      id: string;
      idModel: string;
      description: string | null;
      callbackURL: string;
      active: boolean;
      consecutiveFailures: number;
      firstConsecutiveFailDate: string | null;
    }>
  >({
    path: `/tokens/${credentials.token}/webhooks`,
    credentials,
  });
}

export async function createTrelloWebhook(
  {
    callbackURL,
    idModel,
    description,
  }: { callbackURL: string; idModel: string; description?: string },
  credentials: TrelloCredentials,
) {
  return trelloRequest<{
    id: string;
    idModel: string;
    callbackURL: string;
    active: boolean;
    description: string | null;
  }>({
    method: "POST",
    path: "/webhooks",
    credentials,
    query: {
      callbackURL,
      idModel,
      description,
    },
  });
}

export async function deleteTrelloWebhook(idWebhook: string, credentials: TrelloCredentials) {
  return trelloRequest<{ _value?: string }>({
    method: "DELETE",
    path: `/webhooks/${idWebhook}`,
    credentials,
  });
}
