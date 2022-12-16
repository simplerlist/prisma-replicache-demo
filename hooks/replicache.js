// Packages
import { useState, useEffect } from 'react'
import { getCookie } from 'cookies-next'
import { Replicache } from 'replicache'
// Mutations
import mutationTodoCreate from 'mutations/todo/create'
import mutationTodoDelete from 'mutations/todo/delete'
import mutationTodoGet from 'mutations/todo/get'
import mutationTodoUpdate from 'mutations/todo/update'

const HooksReplicache = () => {
	const [spaceId, setSpaceId] = useState(null)
	const [userId, setUserId] = useState(null)
	const [rep, setRep] = useState(null)

	useEffect(() => {
		setSpaceId(window.localStorage.getItem('spaceId'))

		setUserId(getCookie('userId'))
	}, [])

	useEffect(() => {
		if (userId && spaceId) {
			const r = new Replicache({
				name: `${userId}/${spaceId}`,
				licenseKey: process.env.NEXT_PUBLIC_REPLICACHE,
				pushURL: `/api/replicache/push?spaceId=${spaceId}`,
				pullURL: `/api/replicache/pull?spaceId=${spaceId}`,
				mutators: {
					create: mutationTodoCreate,
					delete: mutationTodoDelete,
					get: mutationTodoGet,
					update: mutationTodoUpdate
				}
			})

			setRep(r)

			return () => void r.close()
		}
	}, [spaceId, userId])

	return { data: rep }
}

export default HooksReplicache
