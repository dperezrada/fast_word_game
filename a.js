parrot = db.parrots.findOne();
suscription = db.suscriptions.findOne();
for(var i = 0; i<19; i++){
	delete parrot['_id'];
	db.parrots.save(parrot);
	delete suscription['_id'];
	suscription['parrot_id'] = parrot._id;
	db.suscriptions.insert(suscription);
}

