import type { Middleware } from "@wsvaio/utils";
export type { Middleware };

export interface ResponseType<D> {
	data: D;
	status: Response["status"];
	statusText: Response["statusText"];
	ok: Response["ok"];
	response: Response & { data: any };
}

export interface RequestType<
	T extends {
		B?: Record<any, any>;
		Q?: Record<any, any>;
		P?: Record<any, any>;
	}
> {
	// fetch配置
	cache?: RequestCache;
	credentials?: RequestCredentials;
	integrity?: string;
	keepalive?: boolean;
	mode?: RequestMode;
	redirect?: RequestRedirect;
	referrer?: string;
	referrerPolicy?: ReferrerPolicy;
	signal?: AbortSignal | null;
	window?: null;
	// 以上为fetch配置

	method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
	headers: Record<any, any>;
	url: string;
	baseURL: string;

	body: Record<any, any> | BodyInit | null;
	query: Record<any, any> | null;
	param: Record<any, any> | null;

	b: T["B"] & Record<any, any>;
	q: T["Q"] & Record<any, any>;
	p: T["P"] & Record<any, any>;
}

export type BasicContext<
	T extends {
		B?: Record<any, any>;
		Q?: Record<any, any>;
		P?: Record<any, any>;
		D?: any;
		C?: Record<any, any>;
	}
> = {
	log: boolean;
	timeout: number;
	message: string;

	dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";

	befores: Middleware<BeforeContext<T>>[];
	afters: Middleware<AfterContext<T>>[];
	errors: Middleware<ErrorContext<T>>[];
	finals: Middleware<FinalContext<T>>[];
} & T["C"];

export type BeforeContext<
	T extends {
		B?: Record<any, any>;
		Q?: Record<any, any>;
		P?: Record<any, any>;
		D?: any;
		C?: Record<any, any>;
	}
> = BasicContext<T> & RequestType<T>;

export type AfterContext<
	T extends {
		B?: Record<any, any>;
		Q?: Record<any, any>;
		P?: Record<any, any>;
		D?: any;
		C?: Record<any, any>;
	}
> = BasicContext<T> & RequestType<T> & ResponseType<T["D"]>;

export type ErrorContext<
	T extends {
		B?: Record<any, any>;
		Q?: Record<any, any>;
		P?: Record<any, any>;
		D?: any;
		C?: Record<any, any>;
	}
> = BasicContext<T> & RequestType<T> & Partial<ResponseType<T["D"]>> & { error: Error };

export type FinalContext<
	T extends {
		B?: Record<any, any>;
		Q?: Record<any, any>;
		P?: Record<any, any>;
		D?: any;
		C?: Record<any, any>;
	}
> = BasicContext<T> & RequestType<T> & Partial<ResponseType<T["D"]>> & { error?: Error };

export type Context<
	T extends {
		B?: Record<any, any>;
		Q?: Record<any, any>;
		P?: Record<any, any>;
		D?: any;
		C?: Record<any, any>;
	} = {
		B: Record<any, any>;
		Q: Record<any, any>;
		P: Record<any, any>;
		D: any;
		C: Record<any, any>;
	}
> = Partial<BasicContext<T> & RequestType<T> & ResponseType<T["D"]> & { error: Error }>;


