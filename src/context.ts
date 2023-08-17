import { merge } from "@wsvaio/utils";
import type { Context } from "./types.d";

const CONTEXT: Context = {};

export const mergeContext = (context1: Context, context2: Context) =>
	merge(context1, context2, {
		deep: Number.POSITIVE_INFINITY,
	});

export const createContext = (): Context =>
	mergeContext(
		{
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

			befores: [],
			afters: [],
			errors: [],
			finals: [],

			message: "",
		},
		CONTEXT
	);
