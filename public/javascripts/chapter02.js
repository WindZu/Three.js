function init() {
    var stats = initStats();

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    var step = 0;
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;
        this.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };
        this.addCube = function () {
            var cubeSize = Math.ceil((Math.random() * 3));//Math.ceil()向上取整
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;//scene,children返回scene的所有子对象 length代表这个子对象数组的长度，即子对象个数（camera，renderer都属于scene的children）

            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            scene.add(cube);
            this.numberOfObjects = scene.children.length;//最后更新一下scene中children的个数
        };
        this.outputObjects = function () {
            console.log(scene.children);//控制台输出所有children的信息,便于调试
        }
    };
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    render();
    function render() {
        stats.update();
        
        //将function作为traverse（）的方法，用于遍历scene的每一个子对象，并作为参数传给e
        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {//判断该子对象是否是属于Mesh（而不是camera或者renderer），并且也不是plane
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });
        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    function initStats() {
        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms
        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }
}
window.onload = init