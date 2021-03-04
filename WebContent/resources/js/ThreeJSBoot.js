class ThreeJSBoot {
 
    renderer;
    scene;
    camera;
    light;
    controls;
    //바뀔거같은 값들 변수로 빼주기

    createStage(html){
        this.scene = new THREE.Scene();
        this.#setRenderal(html); //middle이 들어가는건 html을 매개변수로
        this.#setCamera(html);
        this.#setControls();
        this.#setLight();
    }

    #setRenderal(e){ //e가 middle로
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(e.clientWidth, e.clientHeight);
        e.appendChild(this.renderer.domElement);
    }

    #setCamera(e){
        this.camera = new THREE.PerspectiveCamera(75, e.clientWidth / e.clientHeight, 0.1, 1000); 
        this.camera.position.z = 10;
    }

    #setLight() {
        this.light = new THREE.DirectionalLight("white", 1);
        this.light.position.set(-3, 2, 10);
        this.scene.add(this.light);
      }

    #setControls(){
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
    }


    createObject(geometry, property, material) {
        let mashMaterial = material?material:new THREE.MeshPhongMaterial(property);
        return new THREE.Mesh(geometry, mashMaterial);
      }

    #loadFont(url){
        return new Promise((resolve,reject)=>{
            new THREE.FontLoader().load(url,resolve); 
            //function넣을 자리에 resolve을 넣어줌
            //resolve(결과값으로 돌려주고 싶은 객체)

        });
    }

    createText(url, text, color, size, height, material){
        let asyncFont = async () =>{
            let font = await this.#loadFont(url);
            const fontGeo = new THREE.TextGeometry(text, {
                font: font,
                size: size?size:1,
                height: height?hegiht:0.3,
                curveSegments: 12,
            });

            const meshMaterial = material?material:new THREE.MeshPhongMaterial({ color: color });
            const objText = new THREE.Mesh(fontGeo,meshMaterial);
            return objText;

        }
        return asyncFont();
    }


    createObjectFromObj(objUrl,mtlUrl){
        let asyncObj = async() => {
            let mtl = await this.#loadMtl(mtlUrl);
            let obj = await this.#loadObj(objUrl,mtl);
            this.scene.add(obj);
            return obj; 
        }
            return asyncObj();
    }

    #loadMtl(url){
        return new Promise ((resolve,reject)=>{
            new THREE.MTLLoader().load(url,resolve);
        })
    }

    #loadObj(url,mtl){
        mtl.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(mtl);
        return new Promise ((resolve,reject)=>{
            objLoader.load(url,resolve);
        })
    }

}