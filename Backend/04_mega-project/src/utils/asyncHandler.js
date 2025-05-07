// We will use async function multiple times so we are puting it in utils
//asyncHandler using Promises
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}

//we are passing a function as a parameter in a async function
// asyncHandler using try catch
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);

//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }