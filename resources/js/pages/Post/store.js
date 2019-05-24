import {createStore} from "redux";


// const getUser = () => {
//     return async () => {
//         let user = {};
//         await axios.get('/user').then((data) => {
//             user = data;
//         }).catch(()=>{});
//         return user;
//     }
// };

function template_modal_show(state, action){
    switch (action.type) {
        case 'show':
            state = true;
            break;
        case 'hide':
        default:
            state = false;
            break;
    }
    return state;
}

const TemplateModalShow = createStore(template_modal_show);

export {TemplateModalShow}
