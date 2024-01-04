import { useState } from 'react';

type Action = (...args: Array<any>) => Promise<any>;

export const useLoading = (action: Action): [boolean, Action] => {
	const [loading, setLoading] = useState<boolean>(false);

	const doAction: Action = async (...args) => {
		setLoading(true);
		try {
			return await action(...args);
		} finally {
			setLoading(false);
		}
	};

	return [loading, doAction];
};