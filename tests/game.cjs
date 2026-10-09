const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const nodes={};
function node(id){return nodes[id]??={value:'',checked:false,disabled:false,innerHTML:'',textContent:'',style:{},attributes:{},children:[],hidden:false,classList:{add(){},remove(){},toggle(){}},append(child){this.children.push(child)},replaceChildren(...children){this.children=children},setAttribute(k,v){this.attributes[k]=v},addEventListener(){}}}
const context={document:{getElementById:node,querySelector:()=>node('answers'),createElement:()=>({})},Math,console};
node('show-signature').checked=true;
vm.createContext(context);
vm.runInContext(readFileSync(new URL('../src/app.js',`file://${__filename}`),'utf8'),context);
const run=code=>vm.runInContext(code,context);
// Positions follow conventional treble-clef armatures, including octaves.
assert.deepEqual(Array.from(run('sharpPositions.map(([n,o])=>noteY(n,o))')),[25,47.5,17.5,40,62.5,32.5,55]);
assert.deepEqual(Array.from(run('flatPositions.map(([n,o])=>noteY(n,o))')),[55,32.5,62.5,40,70,47.5,77.5]);
for(let count=-7;count<=7;count++){
 run(`draw(${count})`);
 const svg=node('staff').innerHTML;
 assert.equal((svg.match(/data-note=/g)||[]).length,Math.abs(count));
 assert(!svg.includes('<text'),'Notation must not depend on font metrics');
}
// Verify each Phrygian scale independently by its diatonic pitch collection.
const records=JSON.parse(run('JSON.stringify(keys)'));
const letters=['Do','Re','Mi','Fa','Sol','La','Si'];
const pitches=[0,2,4,5,7,9,11];
for(const [major,minor,count,phrygian] of records){
 const alterations={};const order=count>0?['Fa','Do','Sol','Re','La','Mi','Si']:['Si','Mi','La','Re','Sol','Do','Fa'];
 for(const n of order.slice(0,Math.abs(count)))alterations[n]=Math.sign(count);
 const root=letters.findIndex(n=>phrygian.startsWith(n));
 const expectedName=letters[root]+(alterations[letters[root]]===1?'♯':alterations[letters[root]]===-1?'♭':'');
 assert.equal(phrygian,expectedName);
 const majorIndex=letters.findIndex(n=>major.startsWith(n));
 assert.equal(root,(majorIndex+2)%7);
 const notes=Array.from({length:8},(_,i)=>{const step=(root+i)%7;return (pitches[step]+(alterations[letters[step]]||0)+12)%12});
 assert.deepEqual(notes.slice(1).map((n,i)=>(n-notes[i]+12)%12),[1,2,2,2,1,2,2]);
}
for(const enabled of [false,true]){
 node('include-phrygian').checked=enabled;run('changeMode()');
 for(let i=0;i<10;i++){
  const key=JSON.parse(run('JSON.stringify(deck[index])'));
  node('major').value=key[0];node('minor').value=key[1];
  if(enabled){node('phrygian').value='';run('submit()');assert.equal(run('checked'),false);node('phrygian').value=key[3]}
  run('submit()');assert.equal(run('checked'),true);run('submit()');
 }
 assert.equal(run('hits'),10);assert.equal(run('index'),10);
}
node('include-phrygian').checked=true;run('changeMode()');
node('major').value=run('deck[index][0]');node('minor').value=run('deck[index][1]');node('phrygian').value='wrong';run('submit()');assert.equal(run('hits'),0);
run('changeMode()');assert.equal(run('index'),0);assert.equal(run('checked'),false);assert.equal(node('phrygian').disabled,false);
console.log('Verified all 15 signatures, conventional treble positions, all Phrygian interval patterns, both game modes, missing/incorrect Phrygian answers, and mode restart.');

// Fixed randomness verifies shuffling without a flaky statistical assertion.
const seededMath=Object.create(Math);seededMath.random=()=>0;
context.Math=seededMath;run('start()');
for(const [id,column] of [['major',0],['minor',1],['phrygian',3]]){
 const expected=[...new Set(records.map(k=>k[column]))];
 const actual=node(id).children.map(o=>o.value);
 assert.equal(actual[0],'');
 assert.deepEqual(actual.slice(1).sort(),[...expected].sort());
 assert.notDeepEqual(actual.slice(1),expected);
 assert.equal(new Set(actual.slice(1)).size,expected.length);
}
const oldState=run('JSON.stringify([index,hits,streak,checked])');
node('major').value=run('deck[index][0]');
node('show-signature').checked=false;run('updateImage()');
assert.equal(node('staff').hidden,true);assert.equal(node('staff').innerHTML,'');
assert.equal(run('JSON.stringify([index,hits,streak,checked])'),oldState);
assert.equal(node('major').value,run('deck[index][0]'));
assert.equal(node('prompt').textContent,run('label(deck[index][2])'));
run('show()');assert.equal(node('staff').hidden,true);assert.equal(node('staff').innerHTML,'');
node('show-signature').checked=true;run('updateImage()');
assert.equal(node('staff').hidden,false);assert(node('staff').innerHTML.includes('<line'));
console.log('Verified independently shuffled complete answer lists and image toggle without changing score or selections.');
