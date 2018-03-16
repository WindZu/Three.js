if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer;
//var object;
var man;
var mixer, animationClip;

var positionBuffer=new Array(5);

var idleAction, walkAction, runAction;
var idleWeight, walkWeight, runWeight;
var actions;
var clock = new THREE.Clock();
var sizeOfNextStep = 0;


init();
animate();

function init() {
    container = document.querySelector('#threejs')
    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcce0ff );
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
    // camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 1000, 50, 1500 );
    camera.lookAt(0,0,0);
    // lights
    var light, materials;
    scene.add( new THREE.AmbientLight( 0x666666 ) );
    light = new THREE.DirectionalLight( 0xdfebff, 1 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    var d = 300;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;
    scene.add( light );


    // ground
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load( 'textures/terrain/grasslight-big.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = -150;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    var manager = new THREE.LoadingManager();

    //人物轨迹点
    var spline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(500,0,0),
        new THREE.Vector3(0,0,500),
        new THREE.Vector3(-500,0,0),
        new THREE.Vector3(0,0,-500),
        new THREE.Vector3(500,0,0)
    ]);
    var points = spline.getPoints(200);//细分数为20，从spline曲线上获取系列顶点数据
    var index=0;

    //model
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) {
    };
    var loader = new THREE.OBJLoader( manager );
    // loader.load( 'models/man.obj', function ( object ) {
    //     man=object;
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {
    //         }
    //     } );
    //     object.position.set(0,0,0);
    //     object.scale.x=1;
    //     object.scale.y=1;
    //     object.scale.z=1;
    //     scene.add( object );
    // }, onProgress, onError );

    var mesh;
    new THREE.ObjectLoader().load( 'models/marine/marine_anims_core.json', function ( loadedObject ) {
        loadedObject.traverse( function ( child ) {
            if ( child instanceof THREE.SkinnedMesh ) {
                mesh = child;
            }
        } );
        var object=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xff0000}));
        object.position.set(300,0,0);
        //mesh.lookAt(object);
        scene.add( mesh );
        skeleton = new THREE.SkeletonHelper( mesh );
        skeleton.visible = false;
        scene.add( skeleton );
        mesh.rotation.y+=Math.PI/2;

        mixer = new THREE.AnimationMixer( mesh );

        idleAction = mixer.clipAction( 'idle' );
        walkAction = mixer.clipAction( 'walk' );

        walkAction.enabled = true;
        walkAction.setEffectiveTimeScale( 1 );
        walkAction.setEffectiveWeight( 1 );
        walkAction.play();

        var startPoint1=new THREE.Vector3(0,0,0);//起始向量的起点
        var endPoint1=new THREE.Vector3(0,0,-1);//起始向量终点
        var startPoint2=new THREE.Vector3();//结束向量起点
        var endPoint2=new THREE.Vector3();//结束向量终点

        var rotateStart=new THREE.Vector3();//起始向量
        var rotateEnd=new THREE.Vector3();//结束向量
        



        function pointAnimate() {
            mesh.position.set(points[index].x, -150, points[index].z);
            index++;
            if(index>=200) {
                index = 0;
            }
            if(index%10==0)
                rotateMesh();

            //计算四元数
            function rotateMatrix(rotateStart, rotateEnd){
                var axis = new THREE.Vector3();
                var  quaternion = new THREE.Quaternion();
                    
                //得到开始和结束向量间的夹角    
                var angle=rotateStart.angleTo(rotateEnd);

                if (angle){  //如果夹角等于0， 说明物体没有旋转
                    axis.crossVectors(rotateStart, rotateEnd).normalize();  //rotateStart,rotateEnd向量乘积 标准化 得到旋转轴
                    angle *= 1; //rotationSpeed旋转系数 得到旋转弧度
                    quaternion.setFromAxisAngle(axis, angle);  //从一个旋转轴和旋转弧度得到四元组， 如果要让物体相反方向旋转 设置angle为负
                }
                return quaternion; //返回一个旋转的四元数
            }

            function rotateMesh(){
                startPoint2=points[index];
                endPoint2=points[index+1];

                rotateStart.sub(endPoint1,startPoint1);//计算向量
                rotateEnd.sub(endPoint2,startPoint2);

                rotateQuaternion = rotateMatrix(rotateStart,rotateEnd);
                var curQuaternion = object.quaternion;
                curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion); //设置四元组 a x b
                curQuaternion.normalize();
                mesh.setRotationFromQuaternion(curQuaternion);  //方法通过规范化的旋转四元数直接应用旋转  参数必须normalize()
                startPoint1=points[index];
                endPoint1=points[index+1];
            };

            requestAnimationFrame(pointAnimate);
        }
        pointAnimate();
    });


    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setPath( 'models/Scene/' );
    // mtlLoader.load( 'Scene.mtl', function( materials ) {
    //     materials.preload();
    //     var objLoader = new THREE.OBJLoader();
    //     objLoader.setMaterials( materials );
    //     objLoader.setPath( 'models/Scene/' );
    //     objLoader.load( 'Scene.obj', function ( object ) {
    //         object.position.y = - 95;
    //         object.scale.x=100;
    //         object.scale.y=100;
    //         object.scale.z=100;
    //         scene.add( object );
    //     }, onProgress, onError );
    // });



    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.renderSingleSided = false;

    container.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    // controls
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;
    // performance monitor
    stats = new Stats();
    container.appendChild( stats.dom );
    window.addEventListener( 'resize', onWindowResize, false );


}

//监听屏幕尺寸改变
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


//动画
function animate() {
    requestAnimationFrame( animate ); 
    mixer.update( clock.getDelta() );
    render();
    stats.update();
}
function render() {
    renderer.render( scene, camera );
}







