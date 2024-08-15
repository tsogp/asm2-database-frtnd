export interface FormField<T> {
	data: T;
	validator: () => boolean;
	invalid: boolean;
	error: string;
};
