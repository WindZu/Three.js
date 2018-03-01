function init() {
    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);

    var renderer=new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled=true;//开启阴影渲染

    var axes=new THREE.AxisHelper(20);
    scene.add(axes);

    //点光源
    var spotLight=new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow=true;//点光源开启产生阴影
    scene.add(spotLight);

    //平面
    var planeGeometry=new THREE.PlaneGeometry(60,20,1,1);
    //var planeMaterial=new THREE.MeshBasicMaterial({color:0xcccccc});//基本材质只会使用指定的颜色来渲染物体（不会对光源有反应）
    var planeMaterial=new THREE.MeshLambertMaterial({color:0xffffff});
    var plane=new THREE.Mesh(planeGeometry,planeMaterial);

    plane.rotation.x=-0.5*Math.PI;
    plane.position.x=15;
    plane.position.y=0;
    plane.position.z=0;

    plane.receiveShadow=true;//平面接受阴影

    scene.add(plane);


    //立方体（BoxGeometry）
    //BoxGeometry(width, height, dept, widthSegments, heightSegments, depthSegments) 
    //width,height,dept分别是长宽高 
    //widthSegments, heightSegments, deptSegments是对应长宽高的分段
    //({wireframe:true})使用线模式进行渲染
    var cubeGeometry=new THREE.BoxGeometry(4,4,4);
    //var cubeMaterial=new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true});//基本材质只会使用指定的颜色来渲染物体（不会对光源有反应）
    var cubeMaterial=new THREE.MeshLambertMaterial({color:0xffffff});
    var cube=new THREE.Mesh(cubeGeometry,cubeMaterial);

    cube.position.x=-4;
    cube.position.y=3;
    cube.position.z=0;

    cube.castShadow=true;//立方体投射阴影

    scene.add(cube);

    //球体（SphereGeometry）
    //SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) 
    //radius：球体半径 
    //widthSegments, heightSegments：水平方向和垂直方向上分段数。widthSegments最小值为3，默认值为8。heightSegments最小值为2，默认值为6。 
    //phiStart：水平方向上的起始角,默认值0 
    //phiLenght：水平方向上球体曲面覆盖的弧度，默认Math.PI * 2 
    //thetaStart : 垂直方向上的起始角， 默认0 
    //thetaLength: 垂直方向是球体曲面覆盖的弧度，默认值为Math.PI
    var sphereGeometry=new THREE.SphereGeometry(4,20,20);
    //var sphereMaterial=new THREE.MeshBasicMaterial({color:0x7777ff,wireframe:true});//基本材质只会使用指定的颜色来渲染物体（不会对光源有反应）
    var sphereMaterial=new THREE.MeshLambertMaterial({color:0xffffff});
    var sphere=new THREE.Mesh(sphereGeometry,sphereMaterial);

    sphere.position.x=20;
    sphere.position.y=4;
    sphere.position.z=2;

    sphere.castShadow=true;//球体投射阴影

    scene.add(sphere);

    camera.position.x=-30;
    camera.position.y=40;
    camera.position.z=30;
    camera.lookAt(scene.position);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    renderer.render(scene,camera);

}
window.onload = init;