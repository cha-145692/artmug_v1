/* Cubism 4 / moc3 viewer. Requires locally supplied official Cubism Core runtime. */
(async()=>{
 const stage=document.getElementById('stage'),notice=document.getElementById('notice'),buttons=document.getElementById('expressions');
 const tracking=document.getElementById('tracking');let app,model,baseScale=1,zoom=1,view='full',offset={x:0,y:0},pointer=null,lastTouchDistance=0,activeExpression=null;
 const show=(msg)=>{notice.style.display='block';notice.innerHTML=msg};
 let config;
 try{const res=await fetch('./config.json',{cache:'no-store'});if(!res.ok)throw Error('설정 파일을 찾지 못했습니다.');config=await res.json()}catch(e){show(e.message);return}
 if(!config.model){show('config.json의 model 경로를 입력해 주세요.');return}
 if(!window.Live2DCubismCore||!window.PIXI||!window.PIXI.live2d){show('Live2D 런타임을 불러오지 못했습니다.<small>공식 SDK의 live2dcubismcore.min.js 파일을 live2d/lib/에 추가하세요. 인터넷 연결도 확인하세요.</small>');return}
 try{
  app=new PIXI.Application({resizeTo:stage,backgroundAlpha:0,antialias:true,autoDensity:true,resolution:Math.min(devicePixelRatio||1,2)});stage.appendChild(app.view);
  model=await PIXI.live2d.Live2DModel.from(config.model,{autoInteract:false});app.stage.addChild(model);model.anchor.set(.5,.5);
  const expressions=model.internalModel?.settings?.expressions||[];
  buttons.innerHTML='';
  const makeButton=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.addEventListener('click',()=>{buttons.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');fn()});buttons.appendChild(b)};
  makeButton('기본',()=>{activeExpression=null;model.expression()});
  expressions.forEach((ex,i)=>makeButton((config.expressionLabels||{})[ex.Name||ex.name]||ex.Name||ex.name||`표정 ${i+1}`,()=>{activeExpression=i;model.expression(i)}));
  if(!expressions.length){const msg=document.createElement('span');msg.className='muted';msg.textContent='이 모델에는 내보낸 표정 파일(.exp3.json)이 없어 기본 표정만 사용할 수 있습니다.';buttons.appendChild(msg);}
  notice.style.display='none';
  function layout(){const w=stage.clientWidth,h=stage.clientHeight;const factor=view==='face'?2.9:view==='upper'?1.75:1;const fit=Math.min(w/model.width,h/model.height)*.85;baseScale=fit*factor;model.scale.set(baseScale*zoom);model.position.set(w/2+offset.x,h/2+offset.y+(view==='face'?h*.47:view==='upper'?h*.26:0))}
  function resize(){app.renderer.resize(stage.clientWidth,stage.clientHeight);layout()};window.addEventListener('resize',resize);layout();
  let target={x:0,y:0},current={x:0,y:0};
  function moveLook(x,y){const r=stage.getBoundingClientRect();target.x=Math.max(-1,Math.min(1,((x-r.left)/r.width-.5)*2));target.y=Math.max(-1,Math.min(1,((y-r.top)/r.height-.5)*2))}
  app.ticker.add(()=>{if(!tracking.checked||!model)return;current.x+=(target.x-current.x)*.13;current.y+=(target.y-current.y)*.13;const core=model.internalModel?.coreModel;if(!core)return;for(const [id,val] of [['ParamAngleX',current.x*24],['ParamAngleY',-current.y*18],['ParamEyeBallX',current.x],['ParamEyeBallY',-current.y]]){try{core.setParameterValueById(id,val)}catch(e){}}});
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){pointer={x:e.clientX,y:e.clientY};stage.setPointerCapture(e.pointerId)}moveLook(e.clientX,e.clientY)});
  stage.addEventListener('pointermove',e=>{moveLook(e.clientX,e.clientY);if(pointer&&e.buttons===1&&e.pointerType==='mouse'){offset.x+=e.clientX-pointer.x;offset.y+=e.clientY-pointer.y;pointer={x:e.clientX,y:e.clientY};layout()}});
  stage.addEventListener('pointerup',()=>pointer=null);stage.addEventListener('pointercancel',()=>pointer=null);
  stage.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.4,Math.min(3,zoom*(e.deltaY>0?.92:1.08)));layout()},{passive:false});
  stage.addEventListener('touchmove',e=>{if(e.touches.length===1){moveLook(e.touches[0].clientX,e.touches[0].clientY)}else if(e.touches.length===2){const a=e.touches[0],b=e.touches[1],dist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(lastTouchDistance){zoom=Math.max(.4,Math.min(3,zoom*dist/lastTouchDistance));layout()}lastTouchDistance=dist}},{passive:true});stage.addEventListener('touchend',()=>lastTouchDistance=0);
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;zoom=1;offset={x:0,y:0};document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));layout()}));
  document.getElementById('reset').addEventListener('click',()=>{view='full';zoom=1;offset={x:0,y:0};target={x:0,y:0};document.querySelector('[data-view="full"]').click();model.expression();buttons.querySelectorAll('button').forEach(x=>x.classList.remove('active'))});
 }catch(e){console.error(e);show('모델을 불러오지 못했습니다.<small>'+String(e.message).replace(/[<>&]/g,'')+'<br>모델 경로와 JSON 내부 파일 경로를 확인하세요.</small>')}
})();