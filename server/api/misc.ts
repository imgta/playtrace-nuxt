// example, try going to: localhost:3000/api/hello?blah=hoho
export default defineEventHandler(async (e) => {
    if (e.req.method === 'GET') {
        const query = getQuery(e)
        // console.log('server/api/hello called:', query.blah)

        return JSON.stringify(query.blah)
    }
    //  else if (e.req.method === 'POST') {
    //     const body: { item: string } = await useBody(e);

    //     if (!body.item) { throw new Error() };

    //     const newTodo = {
    //         item: body.item,
    //         completed: false
    //     }

    //     return newTodo;
    // }
})
