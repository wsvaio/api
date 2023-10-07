import { merge, omit } from "@wsvaio/utils";
import type { Context } from "./types.d";

export const mergeContext = (context: Context, ...contexts: Context[]) => {
	const keys = ["befores", "afters", "errors", "finals"] as const;
	keys.forEach(key => {
		!Array.isArray(context[key]) && (context[key] = []);
		contexts
			.filter(item => !!item)
			.forEach(item => {
				Array.isArray(item[key]) && context[key].push(...item[key]);
				merge(context, omit(item, [...keys]), {
					deep: Number.POSITIVE_INFINITY,
				});
			});
	});
	return context;
};

export const createContext = (): Context => ({
	method: "get",
	headers: {},
	log: false,
	timeout: 0,
	url: "/",
	baseURL: "",

	b: {},
	q: {},
	p: {},

	query: null,
	body: null,
	param: null,

	normal: true,

	befores: [],
	afters: [],
	errors: [],
	finals: [],

	message: "",
});
