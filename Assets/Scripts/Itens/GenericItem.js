#pragma strict
class ProbableItem
{
	var item : GameObject;
	var probability : float;
}

var chanceToSpawnSomething : float;
var probableItem : ProbableItem[];

function OnDrawGizmos ()
{
	Gizmos.color = Color.red;
	Gizmos.DrawWireSphere (transform.position, 1);
}

function OnSpawned ()
{
	yield;
	if (PlayerStatus.invunerable)
	 	return;
	 if (Random.value*100 <chanceToSpawnSomething)
		PoolManager.Pools["Itens"].Spawn(probableItem[ChooseItem()].item.transform,transform.position,Quaternion.identity);
}

function ChooseItem()
{
	var total = 0;
	var i = 0;
	/*for (elem in probableItem)
	{
		total += elem;
	}*/
	
	total = probableItem.Length;

	var randomPoint = Random.value * total;

	for (i = 0; i < probableItem.Length; i++) {
		if (randomPoint < probableItem[i].probability)
			return i;
		else
			randomPoint -= probableItem[i].probability;
	}

	return probableItem.Length - 1;
}