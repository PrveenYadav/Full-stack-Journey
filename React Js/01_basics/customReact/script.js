const mainContainer = document.querySelector("#root");

const reactElement = {
    type: 'a',
    props: {
        href: 'https://google.com',
        target: '_blank'
    },
    children: "click me to visit google"
}

function customRender(reactElement, container){
    const domElement = document.createElement(reactElement.type);
    domElement.innerHTML = reactElement.children;
    domElement.setAttribute('href', reactElement.props.href)
    domElement.setAttribute('target', reactElement.props.target)

    container.appendChild(domElement);
}
customRender(reactElement, mainContainer)

//better than above
function customRender1(reactElement, container){
    const domElement = document.createElement(reactElement.type);
    domElement.innerHTML = reactElement.children;
    for(const prop in reactElement.props) {
        if(prop === 'children') continue
        domElement.setAttribute(prop, reactElement.props[prop])
    }

    container.appendChild(domElement);
}
customRender1(reactElement, mainContainer)


//React did this under the hood