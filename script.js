const tenseOrder = ['Présent', 'Imparfait', 'Passé composé', 'Futur simple'];
const personOrder = ['io', 'tu', 'lui', 'noi', 'voi', 'loro'];

const categoryMeta = {
  auxiliary: { label: 'Auxiliaries', verbs: ['être', 'avoir'] },
  'first group': { label: 'Group 1', verbs: ['parler', 'aimer', 'travailler', 'regarder', 'écouter', 'demander', 'trouver', 'donner', 'manger', 'commencer'] },
  'second group': { label: 'Group 2', verbs: ['finir', 'choisir'] },
  'third group': { label: 'Group 3', verbs: ['lire', 'écrire', 'boire', 'courir', 'croire'] },
  'irregular/frequent': { label: 'Frequent/Irregular Verbs', verbs: ['aller', 'faire', 'venir', 'pouvoir', 'vouloir', 'devoir', 'savoir', 'prendre', 'mettre', 'dire', 'voir', 'partir', 'sortir', 'dormir', 'connaître'] }
};

const verbData = [
  { infinitive: 'être', italian: 'essere', category: 'auxiliary', conjugations: { Présent: { io: 'suis', tu: 'es', lui: 'est', noi: 'sommes', voi: 'êtes', loro: 'sont' }, Imparfait: { io: 'étais', tu: 'étais', lui: 'était', noi: 'étions', voi: 'étiez', loro: 'étaient' }, 'Passé composé': { io: 'ai été', tu: 'as été', lui: 'a été', noi: 'avons été', voi: 'avez été', loro: 'ont été' }, 'Futur simple': { io: 'serai', tu: 'seras', lui: 'sera', noi: 'serons', voi: 'serez', loro: 'seront' } } },
  { infinitive: 'avoir', italian: 'avere', category: 'auxiliary', conjugations: { Présent: { io: 'ai', tu: 'as', lui: 'a', noi: 'avons', voi: 'avez', loro: 'ont' }, Imparfait: { io: 'avais', tu: 'avais', lui: 'avait', noi: 'avions', voi: 'aviez', loro: 'avaient' }, 'Passé composé': { io: 'ai eu', tu: 'as eu', lui: 'a eu', noi: 'avons eu', voi: 'avez eu', loro: 'ont eu' }, 'Futur simple': { io: 'aurai', tu: 'auras', lui: 'aura', noi: 'aurons', voi: 'aurez', loro: 'auront' } } },
  { infinitive: 'aller', italian: 'andare', category: 'irregular/frequent', conjugations: { Présent: { io: 'vais', tu: 'vas', lui: 'va', noi: 'allons', voi: 'allez', loro: 'vont' }, Imparfait: { io: 'allais', tu: 'allais', lui: 'allait', noi: 'allions', voi: 'alliez', loro: 'allaient' }, 'Passé composé': { io: 'suis allé', tu: 'es allé', lui: 'est allé', noi: 'sommes allés', voi: 'êtes allés', loro: 'sont allés' }, 'Futur simple': { io: 'irai', tu: 'iras', lui: 'ira', noi: 'irons', voi: 'irez', loro: 'iront' } } },
  { infinitive: 'faire', italian: 'fare', category: 'irregular/frequent', conjugations: { Présent: { io: 'fais', tu: 'fais', lui: 'fait', noi: 'faisons', voi: 'faites', loro: 'font' }, Imparfait: { io: 'faisais', tu: 'faisais', lui: 'faisait', noi: 'faisions', voi: 'faisiez', loro: 'faisaient' }, 'Passé composé': { io: 'ai fait', tu: 'as fait', lui: 'a fait', noi: 'avons fait', voi: 'avez fait', loro: 'ont fait' }, 'Futur simple': { io: 'ferai', tu: 'feras', lui: 'fera', noi: 'ferons', voi: 'ferez', loro: 'feront' } } },
  { infinitive: 'venir', italian: 'venire', category: 'irregular/frequent', conjugations: { Présent: { io: 'viens', tu: 'viens', lui: 'vient', noi: 'venons', voi: 'venez', loro: 'viennent' }, Imparfait: { io: 'venais', tu: 'venais', lui: 'venait', noi: 'venions', voi: 'veniez', loro: 'venaient' }, 'Passé composé': { io: 'suis venu', tu: 'es venu', lui: 'est venu', noi: 'sommes venus', voi: 'êtes venus', loro: 'sont venus' }, 'Futur simple': { io: 'viendrai', tu: 'viendras', lui: 'viendra', noi: 'viendrons', voi: 'viendrez', loro: 'viendront' } } },
  { infinitive: 'pouvoir', italian: 'potere', category: 'irregular/frequent', conjugations: { Présent: { io: 'peux', tu: 'peux', lui: 'peut', noi: 'pouvons', voi: 'pouvez', loro: 'peuvent' }, Imparfait: { io: 'pouvais', tu: 'pouvais', lui: 'pouvait', noi: 'pouvions', voi: 'pouviez', loro: 'pouvaient' }, 'Passé composé': { io: 'ai pu', tu: 'as pu', lui: 'a pu', noi: 'avons pu', voi: 'avez pu', loro: 'ont pu' }, 'Futur simple': { io: 'pourrai', tu: 'pourras', lui: 'pourra', noi: 'pourrons', voi: 'pourrez', loro: 'pourront' } } },
  { infinitive: 'vouloir', italian: 'volere', category: 'irregular/frequent', conjugations: { Présent: { io: 'veux', tu: 'veux', lui: 'veut', noi: 'voulons', voi: 'voulez', loro: 'veulent' }, Imparfait: { io: 'voulais', tu: 'voulais', lui: 'voulait', noi: 'voulions', voi: 'vouliez', loro: 'voulaient' }, 'Passé composé': { io: 'ai voulu', tu: 'as voulu', lui: 'a voulu', noi: 'avons voulu', voi: 'avez voulu', loro: 'ont voulu' }, 'Futur simple': { io: 'voudrai', tu: 'voudras', lui: 'voudra', noi: 'voudrons', voi: 'voudrez', loro: 'voudront' } } },
  { infinitive: 'devoir', italian: 'dovere', category: 'irregular/frequent', conjugations: { Présent: { io: 'dois', tu: 'dois', lui: 'doit', noi: 'devons', voi: 'devez', loro: 'doivent' }, Imparfait: { io: 'devais', tu: 'devais', lui: 'devait', noi: 'devions', voi: 'deviez', loro: 'devaient' }, 'Passé composé': { io: 'ai dû', tu: 'as dû', lui: 'a dû', noi: 'avons dû', voi: 'avez dû', loro: 'ont dû' }, 'Futur simple': { io: 'devrai', tu: 'devras', lui: 'devra', noi: 'devrons', voi: 'devrez', loro: 'devront' } } },
  { infinitive: 'savoir', italian: 'sapere', category: 'irregular/frequent', conjugations: { Présent: { io: 'sais', tu: 'sais', lui: 'sait', noi: 'savons', voi: 'savez', loro: 'savent' }, Imparfait: { io: 'savais', tu: 'savais', lui: 'savait', noi: 'savions', voi: 'saviez', loro: 'savaient' }, 'Passé composé': { io: 'ai su', tu: 'as su', lui: 'a su', noi: 'avons su', voi: 'avez su', loro: 'ont su' }, 'Futur simple': { io: 'saurai', tu: 'sauras', lui: 'saura', noi: 'saurons', voi: 'saurez', loro: 'sauront' } } },
  { infinitive: 'prendre', italian: 'prendere', category: 'irregular/frequent', conjugations: { Présent: { io: 'prends', tu: 'prends', lui: 'prend', noi: 'prenons', voi: 'prenez', loro: 'prennent' }, Imparfait: { io: 'prenais', tu: 'prenais', lui: 'prenait', noi: 'prenions', voi: 'preniez', loro: 'prenaient' }, 'Passé composé': { io: 'ai pris', tu: 'as pris', lui: 'a pris', noi: 'avons pris', voi: 'avez pris', loro: 'ont pris' }, 'Futur simple': { io: 'prendrai', tu: 'prendras', lui: 'prendra', noi: 'prendrons', voi: 'prendrez', loro: 'prendront' } } },
  { infinitive: 'mettre', italian: 'mettere', category: 'irregular/frequent', conjugations: { Présent: { io: 'mets', tu: 'mets', lui: 'met', noi: 'mettons', voi: 'mettez', loro: 'mettent' }, Imparfait: { io: 'mettais', tu: 'mettais', lui: 'mettait', noi: 'mettions', voi: 'mettiez', loro: 'mettaient' }, 'Passé composé': { io: 'ai mis', tu: 'as mis', lui: 'a mis', noi: 'avons mis', voi: 'avez mis', loro: 'ont mis' }, 'Futur simple': { io: 'mettrai', tu: 'mettras', lui: 'mettra', noi: 'mettrons', voi: 'mettrez', loro: 'mettront' } } },
  { infinitive: 'dire', italian: 'dire', category: 'irregular/frequent', conjugations: { Présent: { io: 'dis', tu: 'dis', lui: 'dit', noi: 'disons', voi: 'dites', loro: 'disent' }, Imparfait: { io: 'disais', tu: 'disais', lui: 'disait', noi: 'disions', voi: 'disiez', loro: 'disaient' }, 'Passé composé': { io: 'ai dit', tu: 'as dit', lui: 'a dit', noi: 'avons dit', voi: 'avez dit', loro: 'ont dit' }, 'Futur simple': { io: 'dirai', tu: 'diras', lui: 'dira', noi: 'dirons', voi: 'direz', loro: 'diront' } } },
  { infinitive: 'voir', italian: 'vedere', category: 'irregular/frequent', conjugations: { Présent: { io: 'vois', tu: 'vois', lui: 'voit', noi: 'voyons', voi: 'voyez', loro: 'voient' }, Imparfait: { io: 'voyais', tu: 'voyais', lui: 'voyait', noi: 'voyions', voi: 'voyiez', loro: 'voyaient' }, 'Passé composé': { io: 'ai vu', tu: 'as vu', lui: 'a vu', noi: 'avons vu', voi: 'avez vu', loro: 'ont vu' }, 'Futur simple': { io: 'verrai', tu: 'verras', lui: 'verra', noi: 'verrons', voi: 'verrez', loro: 'verront' } } },
  { infinitive: 'partir', italian: 'partire', category: 'irregular/frequent', conjugations: { Présent: { io: 'pars', tu: 'pars', lui: 'part', noi: 'partons', voi: 'partez', loro: 'partent' }, Imparfait: { io: 'partais', tu: 'partais', lui: 'partait', noi: 'partions', voi: 'partiez', loro: 'partaient' }, 'Passé composé': { io: 'suis parti', tu: 'es parti', lui: 'est parti', noi: 'sommes partis', voi: 'êtes partis', loro: 'sont partis' }, 'Futur simple': { io: 'partirai', tu: 'partiras', lui: 'partira', noi: 'partirons', voi: 'partirez', loro: 'partiront' } } },
  { infinitive: 'sortir', italian: 'uscire', category: 'irregular/frequent', conjugations: { Présent: { io: 'sors', tu: 'sors', lui: 'sort', noi: 'sortons', voi: 'sortez', loro: 'sortent' }, Imparfait: { io: 'sortais', tu: 'sortais', lui: 'sortait', noi: 'sortions', voi: 'sortiez', loro: 'sortaient' }, 'Passé composé': { io: 'suis sorti', tu: 'es sorti', lui: 'est sorti', noi: 'sommes sortis', voi: 'êtes sortis', loro: 'sont sortis' }, 'Futur simple': { io: 'sortirai', tu: 'sortiras', lui: 'sortira', noi: 'sortirons', voi: 'sortirez', loro: 'sortiront' } } },
  { infinitive: 'dormir', italian: 'dormire', category: 'irregular/frequent', conjugations: { Présent: { io: 'dors', tu: 'dors', lui: 'dort', noi: 'dormons', voi: 'dormez', loro: 'dorment' }, Imparfait: { io: 'dormais', tu: 'dormais', lui: 'dormait', noi: 'dormions', voi: 'dormiez', loro: 'dormaient' }, 'Passé composé': { io: 'ai dormi', tu: 'as dormi', lui: 'a dormi', noi: 'avons dormi', voi: 'avez dormi', loro: 'ont dormi' }, 'Futur simple': { io: 'dormirai', tu: 'dormiras', lui: 'dormira', noi: 'dormirons', voi: 'dormirez', loro: 'dormiront' } } },
  { infinitive: 'parler', italian: 'parlare', category: 'first group', conjugations: { Présent: { io: 'parle', tu: 'parles', lui: 'parle', noi: 'parlons', voi: 'parlez', loro: 'parlent' }, Imparfait: { io: 'parlais', tu: 'parlais', lui: 'parlait', noi: 'parlions', voi: 'parliez', loro: 'parlaient' }, 'Passé composé': { io: 'ai parlé', tu: 'as parlé', lui: 'a parlé', noi: 'avons parlé', voi: 'avez parlé', loro: 'ont parlé' }, 'Futur simple': { io: 'parlerai', tu: 'parleras', lui: 'parlera', noi: 'parlerons', voi: 'parlerez', loro: 'parleront' } } },
  { infinitive: 'aimer', italian: 'amare', category: 'first group', conjugations: { Présent: { io: 'aime', tu: 'aimes', lui: 'aime', noi: 'aimons', voi: 'aimez', loro: 'aiment' }, Imparfait: { io: 'aimais', tu: 'aimais', lui: 'aimait', noi: 'aimions', voi: 'aimiez', loro: 'aimaient' }, 'Passé composé': { io: 'ai aimé', tu: 'as aimé', lui: 'a aimé', noi: 'avons aimé', voi: 'avez aimé', loro: 'ont aimé' }, 'Futur simple': { io: 'aimerai', tu: 'aimeras', lui: 'aimera', noi: 'aimerons', voi: 'aimerez', loro: 'aimeront' } } },
  { infinitive: 'travailler', italian: 'lavorare', category: 'first group', conjugations: { Présent: { io: 'travaille', tu: 'travailles', lui: 'travaille', noi: 'travaillons', voi: 'travaillez', loro: 'travaillent' }, Imparfait: { io: 'travaillais', tu: 'travaillais', lui: 'travaillait', noi: 'travaillions', voi: 'travailliez', loro: 'travaillaient' }, 'Passé composé': { io: 'ai travaillé', tu: 'as travaillé', lui: 'a travaillé', noi: 'avons travaillé', voi: 'avez travaillé', loro: 'ont travaillé' }, 'Futur simple': { io: 'travaillerai', tu: 'travailleras', lui: 'travaillera', noi: 'travaillerons', voi: 'travaillerez', loro: 'travailleront' } } },
  { infinitive: 'regarder', italian: 'guardare', category: 'first group', conjugations: { Présent: { io: 'regarde', tu: 'regardes', lui: 'regarde', noi: 'regardons', voi: 'regardez', loro: 'regardent' }, Imparfait: { io: 'regardais', tu: 'regardais', lui: 'regardait', noi: 'regardions', voi: 'regardiez', loro: 'regardaient' }, 'Passé composé': { io: 'ai regardé', tu: 'as regardé', lui: 'a regardé', noi: 'avons regardé', voi: 'avez regardé', loro: 'ont regardé' }, 'Futur simple': { io: 'regarderai', tu: 'regarderas', lui: 'regardera', noi: 'regarderons', voi: 'regarderez', loro: 'regarderont' } } },
  { infinitive: 'écouter', italian: 'ascoltare', category: 'first group', conjugations: { Présent: { io: 'écoute', tu: 'écoutes', lui: 'écoute', noi: 'écoutons', voi: 'écoutez', loro: 'écoutent' }, Imparfait: { io: 'écoutais', tu: 'écoutais', lui: 'écoutait', noi: 'écoutions', voi: 'écoutiez', loro: 'écoutaient' }, 'Passé composé': { io: 'ai écouté', tu: 'as écouté', lui: 'a écouté', noi: 'avons écouté', voi: 'avez écouté', loro: 'ont écouté' }, 'Futur simple': { io: 'écouterai', tu: 'écouteras', lui: 'écoutera', noi: 'écouterons', voi: 'écouterez', loro: 'écouteront' } } },
  { infinitive: 'demander', italian: 'chiedere', category: 'first group', conjugations: { Présent: { io: 'demande', tu: 'demandes', lui: 'demande', noi: 'demandons', voi: 'demandez', loro: 'demandent' }, Imparfait: { io: 'demandais', tu: 'demandais', lui: 'demandait', noi: 'demandions', voi: 'demandiez', loro: 'demandaient' }, 'Passé composé': { io: 'ai demandé', tu: 'as demandé', lui: 'a demandé', noi: 'avons demandé', voi: 'avez demandé', loro: 'ont demandé' }, 'Futur simple': { io: 'demanderai', tu: 'demanderas', lui: 'demandera', noi: 'demanderons', voi: 'demanderez', loro: 'demanderont' } } },
  { infinitive: 'trouver', italian: 'trovare', category: 'first group', conjugations: { Présent: { io: 'trouve', tu: 'trouves', lui: 'trouve', noi: 'trouvons', voi: 'trouvez', loro: 'trouvent' }, Imparfait: { io: 'trouvais', tu: 'trouvais', lui: 'trouvait', noi: 'trouvions', voi: 'trouviez', loro: 'trouvaient' }, 'Passé composé': { io: 'ai trouvé', tu: 'as trouvé', lui: 'a trouvé', noi: 'avons trouvé', voi: 'avez trouvé', loro: 'ont trouvé' }, 'Futur simple': { io: 'trouverai', tu: 'trouveras', lui: 'trouvera', noi: 'trouverons', voi: 'trouverez', loro: 'trouveront' } } },
  { infinitive: 'donner', italian: 'dare', category: 'first group', conjugations: { Présent: { io: 'donne', tu: 'donnes', lui: 'donne', noi: 'donnons', voi: 'donnez', loro: 'donnent' }, Imparfait: { io: 'donnais', tu: 'donnais', lui: 'donnait', noi: 'donnions', voi: 'donniez', loro: 'donnaient' }, 'Passé composé': { io: 'ai donné', tu: 'as donné', lui: 'a donné', noi: 'avons donné', voi: 'avez donné', loro: 'ont donné' }, 'Futur simple': { io: 'donnerai', tu: 'donneras', lui: 'donnera', noi: 'donnerons', voi: 'donnerez', loro: 'donneront' } } },
  { infinitive: 'manger', italian: 'mangiare', category: 'first group', conjugations: { Présent: { io: 'mange', tu: 'manges', lui: 'mange', noi: 'mangeons', voi: 'mangez', loro: 'mangent' }, Imparfait: { io: 'mangeais', tu: 'mangeais', lui: 'mangeait', noi: 'mangions', voi: 'mangiez', loro: 'mangeaient' }, 'Passé composé': { io: 'ai mangé', tu: 'as mangé', lui: 'a mangé', noi: 'avons mangé', voi: 'avez mangé', loro: 'ont mangé' }, 'Futur simple': { io: 'mangerai', tu: 'mangeras', lui: 'mangera', noi: 'mangerons', voi: 'mangerez', loro: 'mangeront' } } },
  { infinitive: 'commencer', italian: 'cominciare', category: 'first group', conjugations: { Présent: { io: 'commence', tu: 'commences', lui: 'commence', noi: 'commençons', voi: 'commencez', loro: 'commencent' }, Imparfait: { io: 'commençais', tu: 'commençais', lui: 'commençait', noi: 'commencions', voi: 'commenciez', loro: 'commençaient' }, 'Passé composé': { io: 'ai commencé', tu: 'as commencé', lui: 'a commencé', noi: 'avons commencé', voi: 'avez commencé', loro: 'ont commencé' }, 'Futur simple': { io: 'commencerai', tu: 'commenceras', lui: 'commencera', noi: 'commencerons', voi: 'commencerez', loro: 'commenceront' } } },
  { infinitive: 'finir', italian: 'finire', category: 'second group', conjugations: { Présent: { io: 'finis', tu: 'finis', lui: 'finit', noi: 'finissons', voi: 'finissez', loro: 'finissent' }, Imparfait: { io: 'finissais', tu: 'finissais', lui: 'finissait', noi: 'finissions', voi: 'finissiez', loro: 'finissaient' }, 'Passé composé': { io: 'ai fini', tu: 'as fini', lui: 'a fini', noi: 'avons fini', voi: 'avez fini', loro: 'ont fini' }, 'Futur simple': { io: 'finirai', tu: 'finiras', lui: 'finira', noi: 'finirons', voi: 'finirez', loro: 'finiront' } } },
  { infinitive: 'choisir', italian: 'scegliere', category: 'second group', conjugations: { Présent: { io: 'choisis', tu: 'choisis', lui: 'choisit', noi: 'choisissons', voi: 'choisissez', loro: 'choisissent' }, Imparfait: { io: 'choisissais', tu: 'choisissais', lui: 'choisissait', noi: 'choisissions', voi: 'choisissiez', loro: 'choisissaient' }, 'Passé composé': { io: 'ai choisi', tu: 'as choisi', lui: 'a choisi', noi: 'avons choisi', voi: 'avez choisi', loro: 'ont choisi' }, 'Futur simple': { io: 'choisirai', tu: 'choisiras', lui: 'choisira', noi: 'choisirons', voi: 'choisirez', loro: 'choisiront' } } },
  { infinitive: 'lire', italian: 'leggere', category: 'third group', conjugations: { Présent: { io: 'lis', tu: 'lis', lui: 'lit', noi: 'lisons', voi: 'lisez', loro: 'lisent' }, Imparfait: { io: 'lisais', tu: 'lisais', lui: 'lisait', noi: 'lisions', voi: 'lisiez', loro: 'lisaient' }, 'Passé composé': { io: 'ai lu', tu: 'as lu', lui: 'a lu', noi: 'avons lu', voi: 'avez lu', loro: 'ont lu' }, 'Futur simple': { io: 'lirai', tu: 'liras', lui: 'lira', noi: 'lirons', voi: 'lirez', loro: 'liront' } } },
  { infinitive: 'écrire', italian: 'scrivere', category: 'third group', conjugations: { Présent: { io: 'écris', tu: 'écris', lui: 'écrit', noi: 'écrivons', voi: 'écrivez', loro: 'écrivent' }, Imparfait: { io: 'écrivais', tu: 'écrivais', lui: 'écrivait', noi: 'écrivions', voi: 'écriviez', loro: 'écrivaient' }, 'Passé composé': { io: 'ai écrit', tu: 'as écrit', lui: 'a écrit', noi: 'avons écrit', voi: 'avez écrit', loro: 'ont écrit' }, 'Futur simple': { io: 'écrirai', tu: 'écriras', lui: 'écrira', noi: 'écrirons', voi: 'écrirez', loro: 'écriront' } } },
  { infinitive: 'boire', italian: 'bere', category: 'third group', conjugations: { Présent: { io: 'bois', tu: 'bois', lui: 'boit', noi: 'buvons', voi: 'buvez', loro: 'boivent' }, Imparfait: { io: 'buvais', tu: 'buvais', lui: 'buvait', noi: 'buvions', voi: 'buviez', loro: 'buvaient' }, 'Passé composé': { io: 'ai bu', tu: 'as bu', lui: 'a bu', noi: 'avons bu', voi: 'avez bu', loro: 'ont bu' }, 'Futur simple': { io: 'boirai', tu: 'boiras', lui: 'boira', noi: 'boirons', voi: 'boirez', loro: 'boiront' } } },
  { infinitive: 'courir', italian: 'correre', category: 'third group', conjugations: { Présent: { io: 'cours', tu: 'cours', lui: 'court', noi: 'courons', voi: 'courez', loro: 'courent' }, Imparfait: { io: 'courais', tu: 'courais', lui: 'courait', noi: 'courions', voi: 'couriez', loro: 'couraient' }, 'Passé composé': { io: 'ai couru', tu: 'as couru', lui: 'a couru', noi: 'avons couru', voi: 'avez couru', loro: 'ont couru' }, 'Futur simple': { io: 'courrai', tu: 'courras', lui: 'courra', noi: 'courrons', voi: 'courrez', loro: 'courront' } } },
  { infinitive: 'croire', italian: 'credere', category: 'third group', conjugations: { Présent: { io: 'crois', tu: 'crois', lui: 'croit', noi: 'croyons', voi: 'croyez', loro: 'croient' }, Imparfait: { io: 'croyais', tu: 'croyais', lui: 'croyait', noi: 'croyions', voi: 'croyiez', loro: 'croyaient' }, 'Passé composé': { io: 'ai cru', tu: 'as cru', lui: 'a cru', noi: 'avons cru', voi: 'avez cru', loro: 'ont cru' }, 'Futur simple': { io: 'croirai', tu: 'croiras', lui: 'croira', noi: 'croirons', voi: 'croirez', loro: 'croiront' } } },
  { infinitive: 'connaître', italian: 'conoscere', category: 'irregular/frequent', conjugations: { Présent: { io: 'connais', tu: 'connais', lui: 'connaît', noi: 'connaissons', voi: 'connaissez', loro: 'connaissent' }, Imparfait: { io: 'connaissais', tu: 'connaissais', lui: 'connaissait', noi: 'connaissions', voi: 'connaissiez', loro: 'connaissaient' }, 'Passé composé': { io: 'ai connu', tu: 'as connu', lui: 'a connu', noi: 'avons connu', voi: 'avez connu', loro: 'ont connu' }, 'Futur simple': { io: 'connaîtrai', tu: 'connaîtras', lui: 'connaîtra', noi: 'connaîtrons', voi: 'connaîtrez', loro: 'connaîtront' } } }
];

const tenseMap = { Présent: 'Présent', Imparfait: 'Imparfait', 'Passé composé': 'Passé composé', 'Futur simple': 'Futur simple' };
const personMap = { io: 'io', tu: 'tu', lui: 'lui', noi: 'noi', voi: 'voi', loro: 'loro' };
const allTenses = Object.keys(tenseMap);
const allPersons = Object.keys(personMap);
const questionCounts = [10, 20, 30, 50];

const state = {
  selectedVerbIds: new Set(),
  selectedTenseNames: new Set(),
  selectedQuestionCount: 20,
  quizTotal: 20,
  quizQuestions: [],
  currentQuestionIndex: 0,
  score: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  currentQuestion: null,
  isAnswered: false,
  answerSpeechPlayed: false,
  studyVerb: 'être',
  studyTense: 'Présent',
  isConjugationVisible: false,
};

const verbGroups = Object.entries(categoryMeta).map(([id, metadata]) => ({
  id,
  label: metadata.label,
  verbs: verbData.filter((verb) => verb.category === id),
}));

const elements = {
  verbGroupsContainer: typeof document !== 'undefined' ? document.getElementById('verbGroupsContainer') : null,
  tenseSelectionContainer: typeof document !== 'undefined' ? document.getElementById('tenseSelectionContainer') : null,
  questionCountContainer: typeof document !== 'undefined' ? document.getElementById('questionCountContainer') : null,
  startExerciseButton: typeof document !== 'undefined' ? document.getElementById('startExerciseButton') : null,
  homeScreen: typeof document !== 'undefined' ? document.getElementById('homeScreen') : null,
  quizScreen: typeof document !== 'undefined' ? document.getElementById('quizScreen') : null,
  resultsScreen: typeof document !== 'undefined' ? document.getElementById('resultsScreen') : null,
  studyScreen: typeof document !== 'undefined' ? document.getElementById('studyScreen') : null,
  backToHomeButton: typeof document !== 'undefined' ? document.getElementById('backToHomeButton') : null,
  openStudyScreenButton: typeof document !== 'undefined' ? document.getElementById('openStudyScreenButton') : null,
  studyBackButton: typeof document !== 'undefined' ? document.getElementById('studyBackButton') : null,
  questionCounter: typeof document !== 'undefined' ? document.getElementById('questionCounter') : null,
  questionTotal: typeof document !== 'undefined' ? document.getElementById('questionTotal') : null,
  scorePill: typeof document !== 'undefined' ? document.getElementById('scorePill') : null,
  questionPrompt: typeof document !== 'undefined' ? document.getElementById('questionPrompt') : null,
  questionMeta: typeof document !== 'undefined' ? document.getElementById('questionMeta') : null,
  answerInput: typeof document !== 'undefined' ? document.getElementById('answerInput') : null,
  submitAnswerButton: typeof document !== 'undefined' ? document.getElementById('submitAnswerButton') : null,
  showConjugationButton: typeof document !== 'undefined' ? document.getElementById('showConjugationButton') : null,
  conjugationSheet: typeof document !== 'undefined' ? document.getElementById('conjugationSheet') : null,
  nextQuestionButton: typeof document !== 'undefined' ? document.getElementById('nextQuestionButton') : null,
  feedbackRow: typeof document !== 'undefined' ? document.getElementById('feedbackRow') : null,
  feedback: typeof document !== 'undefined' ? document.getElementById('feedback') : null,
  answerPronunciationButton: typeof document !== 'undefined' ? document.getElementById('answerPronunciationButton') : null,
  finalScore: typeof document !== 'undefined' ? document.getElementById('finalScore') : null,
  finalTotal: typeof document !== 'undefined' ? document.getElementById('finalTotal') : null,
  finalPercentage: typeof document !== 'undefined' ? document.getElementById('finalPercentage') : null,
  correctCount: typeof document !== 'undefined' ? document.getElementById('correctCount') : null,
  incorrectCount: typeof document !== 'undefined' ? document.getElementById('incorrectCount') : null,
  newExerciseButton: typeof document !== 'undefined' ? document.getElementById('newExerciseButton') : null,
  studyVerbSelect: typeof document !== 'undefined' ? document.getElementById('studyVerbSelect') : null,
  studyTenseSelect: typeof document !== 'undefined' ? document.getElementById('studyTenseSelect') : null,
  studyConjugationCard: typeof document !== 'undefined' ? document.getElementById('studyConjugationCard') : null,
};

const persons = [
  { key: 'io', italian: 'io' },
  { key: 'tu', italian: 'tu' },
  { key: 'lui', italian: 'lui / lei' },
  { key: 'noi', italian: 'noi' },
  { key: 'voi', italian: 'voi' },
  { key: 'loro', italian: 'loro' }
];

const frenchPersonLabels = {
  io: 'je',
  tu: 'tu',
  lui: 'il / elle',
  noi: 'nous',
  voi: 'vous',
  loro: 'ils / elles',
};

function getCategories() {
  return verbGroups.map((group) => ({
    id: group.id,
    label: group.label,
    verbs: group.verbs.map((verb) => ({ id: verb.infinitive, infinitive: verb.infinitive, italian: verb.italian, category: verb.category }))
  }));
}

function getCategoryVerbIds(categoryId) {
  return verbData.filter((verb) => verb.category === categoryId).map((verb) => verb.infinitive);
}

function getVerbIdsByCategory(categoryId) {
  return getCategoryVerbIds(categoryId);
}

function getSelectedVerbIds() {
  return Array.from(state.selectedVerbIds);
}

function getSelectedTenses() {
  return Array.from(state.selectedTenseNames);
}

function getQuestionCount() {
  return state.selectedQuestionCount;
}

function getQuizTotal() {
  return Number.isInteger(state.quizTotal) && state.quizTotal > 0 ? state.quizTotal : Number(state.selectedQuestionCount) || 0;
}

function formatConjugationRow(personKey, formValue) {
  const cleanValue = String(formValue || '').trim();
  return cleanValue;
}

function getConjugationRows(verbInfinitive, tenseName) {
  const verb = verbData.find((entry) => entry.infinitive === verbInfinitive);
  if (!verb || !verb.conjugations || !verb.conjugations[tenseName]) {
    return [];
  }

  return personOrder.map((personKey) => ({
    key: personKey,
    label: frenchPersonLabels[personKey],
    value: formatConjugationRow(personKey, verb.conjugations[tenseName][personKey]),
    rawValue: verb.conjugations[tenseName][personKey],
  }));
}

function getStudyCardData(verbInfinitive, tenseName) {
  const verb = verbData.find((entry) => entry.infinitive === verbInfinitive);
  if (!verb) {
    return null;
  }

  const rows = getConjugationRows(verbInfinitive, tenseName);

  return {
    infinitive: verb.infinitive,
    italian: verb.italian,
    tense: tenseName,
    rows,
  };
}

function setQuestionCount(value) {
  state.selectedQuestionCount = Number(value);
  state.quizTotal = state.selectedQuestionCount;
  renderQuestionCountSelection();
  updateStartButtonState();
}

function setSelectedVerbs(verbIds) {
  state.selectedVerbIds.clear();
  verbIds.forEach((id) => state.selectedVerbIds.add(id));
  renderVerbSelection();
  updateStartButtonState();
}

function setSelectedTenses(tenses) {
  state.selectedTenseNames.clear();
  tenses.forEach((tense) => state.selectedTenseNames.add(tense));
  renderTenseSelection();
  updateStartButtonState();
}

function getCategorySelectionState(categoryId) {
  const ids = getCategoryVerbIds(categoryId);
  const selectedInCategory = ids.filter((id) => state.selectedVerbIds.has(id));

  if (selectedInCategory.length === 0) return 'none';
  if (selectedInCategory.length === ids.length) return 'all';
  return 'partial';
}

function toggleCategory(categoryId) {
  const ids = getCategoryVerbIds(categoryId);
  const nextState = getCategorySelectionState(categoryId) === 'all' ? 'none' : 'all';

  if (nextState === 'none') {
    ids.forEach((id) => state.selectedVerbIds.delete(id));
  } else {
    ids.forEach((id) => state.selectedVerbIds.add(id));
  }

  renderVerbSelection();
  updateStartButtonState();
}

function toggleVerb(verbId) {
  if (state.selectedVerbIds.has(verbId)) {
    state.selectedVerbIds.delete(verbId);
  } else {
    state.selectedVerbIds.add(verbId);
  }

  renderVerbSelection();
  updateStartButtonState();
}

function renderVerbSelection() {
  if (!elements.verbGroupsContainer) return;

  elements.verbGroupsContainer.innerHTML = '';

  verbGroups.forEach((group) => {
    const groupCard = document.createElement('div');
    groupCard.className = 'group-card';

    const header = document.createElement('div');
    header.className = 'group-header';

    const title = document.createElement('span');
    title.className = 'group-label';
    title.textContent = group.label;

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'group-toggle';
    toggleButton.dataset.groupId = group.id;
    const selectionState = getCategorySelectionState(group.id);
    toggleButton.textContent = selectionState === 'all' ? 'Selected' : selectionState === 'partial' ? 'Partial' : 'Select';
    toggleButton.classList.toggle('is-selected', selectionState !== 'none');
    toggleButton.addEventListener('click', () => toggleCategory(group.id));

    header.appendChild(title);
    header.appendChild(toggleButton);
    groupCard.appendChild(header);

    const verbList = document.createElement('div');
    verbList.className = 'verb-list';

    group.verbs.forEach((verb) => {
      const tagButton = document.createElement('button');
      tagButton.type = 'button';
      tagButton.className = 'tag-btn';
      tagButton.textContent = verb.infinitive;
      tagButton.dataset.verbId = verb.infinitive;
      tagButton.classList.toggle('is-selected', state.selectedVerbIds.has(verb.infinitive));
      tagButton.addEventListener('click', () => toggleVerb(verb.infinitive));
      verbList.appendChild(tagButton);
    });

    groupCard.appendChild(verbList);
    elements.verbGroupsContainer.appendChild(groupCard);
  });
}

function renderTenseSelection() {
  if (!elements.tenseSelectionContainer) return;

  elements.tenseSelectionContainer.innerHTML = '';

  allTenses.forEach((tense) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tense-btn';
    button.dataset.tense = tense;
    button.textContent = tense;
    button.setAttribute('aria-pressed', String(state.selectedTenseNames.has(tense)));
    button.classList.toggle('is-selected', state.selectedTenseNames.has(tense));
    button.addEventListener('click', () => {
      if (state.selectedTenseNames.has(tense)) {
        state.selectedTenseNames.delete(tense);
      } else {
        state.selectedTenseNames.add(tense);
      }
      renderTenseSelection();
      updateStartButtonState();
    });
    elements.tenseSelectionContainer.appendChild(button);
  });
}

function renderQuestionCountSelection() {
  if (!elements.questionCountContainer) return;

  elements.questionCountContainer.innerHTML = '';

  questionCounts.forEach((count) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'count-btn';
    button.textContent = String(count);
    button.classList.toggle('is-selected', count === state.selectedQuestionCount);
    button.addEventListener('click', () => {
      setQuestionCount(count);
    });
    elements.questionCountContainer.appendChild(button);
  });
}

function updateStartButtonState() {
  const hasVerbSelection = getSelectedVerbIds().length > 0;
  const hasTenseSelection = getSelectedTenses().length > 0;
  const validQuestionCount = Number.isInteger(state.selectedQuestionCount) && state.selectedQuestionCount > 0;

  if (elements.startExerciseButton) {
    elements.startExerciseButton.disabled = !(hasVerbSelection && hasTenseSelection && validQuestionCount);
  }
}

function initializeExerciseConfig() {
  verbGroups.forEach((group) => {
    group.verbs.forEach((verb) => state.selectedVerbIds.add(verb.infinitive));
  });
  allTenses.forEach((tense) => state.selectedTenseNames.add(tense));
  state.selectedQuestionCount = 20;
  state.quizTotal = state.selectedQuestionCount;

  renderVerbSelection();
  renderTenseSelection();
  renderQuestionCountSelection();
  updateStartButtonState();
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildQuizQuestions({
  questionCount = state.selectedQuestionCount,
  selectedVerbIds = getSelectedVerbIds(),
  selectedTenses = getSelectedTenses(),
} = {}) {
  const verbPool = verbData.filter((verb) => selectedVerbIds.includes(verb.infinitive));
  if (!verbPool.length || !selectedTenses.length || !questionCount) {
    return [];
  }

  const totalQuestions = Number(questionCount);
  const questions = [];
  const usedCombinations = new Set();

  for (let index = 0; index < totalQuestions; index += 1) {
    let selectedVerb = null;
    let selectedTense = null;
    let selectedPerson = null;
    let attempts = 0;

    while (!selectedVerb && attempts < 200) {
      const candidateVerb = randomFrom(verbPool);
      const candidateTense = randomFrom(selectedTenses);
      const candidatePerson = randomFrom(persons);
      const combinationKey = `${candidateVerb.infinitive}|${candidateTense}|${candidatePerson.key}`;

      if (!usedCombinations.has(combinationKey) || attempts > 80) {
        selectedVerb = candidateVerb;
        selectedTense = candidateTense;
        selectedPerson = candidatePerson;
      }
      attempts += 1;
    }

    if (!selectedVerb || !selectedTense || !selectedPerson) {
      const fallbackVerb = randomFrom(verbPool);
      const fallbackTense = randomFrom(selectedTenses);
      const fallbackPerson = randomFrom(persons);
      selectedVerb = fallbackVerb;
      selectedTense = fallbackTense;
      selectedPerson = fallbackPerson;
    }

    const answer = selectedVerb.conjugations[selectedTense][selectedPerson.key];
    const validAnswers = buildValidAnswers(selectedPerson.key, answer);
    const fullAnswer = validAnswers.length > 0 ? validAnswers[0] : '';
    const question = {
      verb: { ...selectedVerb, id: selectedVerb.infinitive },
      tense: selectedTense,
      person: selectedPerson,
      answer,
      fullAnswer,
      validAnswers,
      prompt: `${selectedPerson.italian} ...`,
      key: `${selectedVerb.infinitive}|${selectedTense}|${selectedPerson.key}`,
    };

    questions.push(question);
    usedCombinations.add(question.key);
  }

  return questions;
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[’‘]/g, "'");
}

function getSpeechText(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[’‘]/g, "'");
}
function startsWithVowelOrH(str) {
  const firstChar = String(str || '').trim().charAt(0).toLowerCase();
  return /[aeiouhàâäéèêëïîôöùûüœæ]/.test(firstChar);
}

function buildValidAnswers(personKey, conjugatedForm) {
  const conjugated = String(conjugatedForm || '').trim();
  if (!conjugated) return [];

  const answers = [];

  if (personKey === 'io') {
    // je: elide only if conjugated form starts with vowel or h
    if (startsWithVowelOrH(conjugated)) {
      answers.push(`j'${conjugated}`);
    } else {
      answers.push(`je ${conjugated}`);
    }
  } else if (personKey === 'tu') {
    answers.push(`tu ${conjugated}`);
  } else if (personKey === 'lui') {
    // Third person singular: accept both il and elle
    answers.push(`il ${conjugated}`);
    answers.push(`elle ${conjugated}`);
  } else if (personKey === 'noi') {
    answers.push(`nous ${conjugated}`);
  } else if (personKey === 'voi') {
    answers.push(`vous ${conjugated}`);
  } else if (personKey === 'loro') {
    // Third person plural: accept both ils and elles
    answers.push(`ils ${conjugated}`);
    answers.push(`elles ${conjugated}`);
  }

  return answers.length > 0 ? answers : [conjugated];
}

function buildFullFrenchAnswer(personKey, conjugatedForm) {
  const answers = buildValidAnswers(personKey, conjugatedForm);
  return answers.length > 0 ? answers[0] : '';
}
function canUseSpeechSynthesis() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function');
}

function getPreferredFrenchVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = (window.speechSynthesis.getVoices && window.speechSynthesis.getVoices()) || [];
  if (voices.length === 0) return null;

  // First pass: find exact fr-FR voice
  const frFrVoice = voices.find((voice) => {
    const lang = (voice.lang || '').toLowerCase();
    return lang === 'fr-fr' || lang === 'fr_fr';
  });
  if (frFrVoice) return frFrVoice;

  // Second pass: find any fr-* voice
  const frenchVoice = voices.find((voice) => {
    const lang = (voice.lang || '').toLowerCase();
    return lang.startsWith('fr');
  });
  if (frenchVoice) return frenchVoice;

  // No French voice found
  return null;
}

function createFrenchSpeechUtterance(answerText) {
  const text = getSpeechText(answerText);

  return {
    text,
    lang: 'fr-FR',
    rate: 0.95,
    pitch: 1,
    volume: 1,
  };
}

function speakCurrentAnswer({ force = false } = {}) {
  if (!state.currentQuestion) return;

  const fullAnswerText = getSpeechText(state.currentQuestion.fullAnswer);
  if (!fullAnswerText) return;
  if (!canUseSpeechSynthesis()) return;
  if (!force && state.answerSpeechPlayed) return;

  const utterance = new window.SpeechSynthesisUtterance(createFrenchSpeechUtterance(fullAnswerText).text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  const preferredVoice = getPreferredFrenchVoice();
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  state.answerSpeechPlayed = true;
}

function resetQuizState() {
  state.quizQuestions = [];
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.correctAnswers = 0;
  state.incorrectAnswers = 0;
  state.currentQuestion = null;
  state.isAnswered = false;
}

function showScreen(screen) {
  elements.homeScreen.classList.toggle('active', screen === 'home');
  elements.quizScreen.classList.toggle('active', screen === 'quiz');
  elements.resultsScreen.classList.toggle('active', screen === 'results');
  elements.studyScreen.classList.toggle('active', screen === 'study');

  elements.homeScreen.classList.toggle('hidden', screen !== 'home');
  elements.quizScreen.classList.toggle('hidden', screen !== 'quiz');
  elements.resultsScreen.classList.toggle('hidden', screen !== 'results');
  elements.studyScreen.classList.toggle('hidden', screen !== 'study');
}

function resetQuestionState() {
  state.isAnswered = false;
  state.isConjugationVisible = false;
  state.answerSpeechPlayed = false;
  elements.answerInput.value = '';
  elements.answerInput.disabled = false;
  if (elements.feedbackRow) {
    elements.feedbackRow.classList.add('hidden');
  }
  if (elements.feedback) {
    elements.feedback.classList.remove('correct', 'incorrect');
  }
  if (elements.answerPronunciationButton) {
    elements.answerPronunciationButton.classList.add('hidden');
  }
  if (elements.showConjugationButton) {
    elements.showConjugationButton.classList.add('hidden');
  }
  if (elements.conjugationSheet) {
    elements.conjugationSheet.classList.add('hidden');
    elements.conjugationSheet.innerHTML = '';
  }
  if (elements.nextQuestionButton) {
    elements.nextQuestionButton.classList.add('hidden');
  }
  if (elements.submitAnswerButton) {
    elements.submitAnswerButton.classList.remove('hidden');
  }
}

function renderQuestion() {
  if (!state.quizQuestions.length) return;

  state.currentQuestion = state.quizQuestions[state.currentQuestionIndex];
  elements.questionCounter.textContent = String(state.currentQuestionIndex + 1);
  if (elements.questionTotal) {
    elements.questionTotal.textContent = String(getQuizTotal());
  }
  elements.scorePill.textContent = String(state.score);
  elements.questionPrompt.textContent = state.currentQuestion.prompt;
  elements.questionMeta.textContent = `Verb: ${state.currentQuestion.verb.infinitive} • Tense: ${state.currentQuestion.tense}`;
  resetQuestionState();
  elements.answerInput.focus();
}

function buildConjugationTableMarkup(verbInfinitive, tenseName, activePersonKey = null) {
  const rows = getConjugationRows(verbInfinitive, tenseName);

  if (!rows.length) {
    return '<p class="study-empty">Coniugazione non disponibile per questo verbo e tempo.</p>';
  }

  const tableRows = rows.map((row) => {
    const highlightClass = activePersonKey && row.key === activePersonKey ? 'is-highlighted' : '';
    return `
      <tr class="${highlightClass}">
        <th>${row.label}</th>
        <td>${row.value}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="conjugation-header">
      <strong>${verbInfinitive}</strong>
      <span>${tenseName}</span>
    </div>
    <table class="conjugation-table">
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
}

function renderConjugationSheet(verbInfinitive, tenseName, activePersonKey = null) {
  elements.conjugationSheet.innerHTML = buildConjugationTableMarkup(verbInfinitive, tenseName, activePersonKey);
  elements.conjugationSheet.classList.remove('hidden');
}

function checkAnswer() {
  if (!state.currentQuestion) return;

  if (!elements.answerInput.value.trim()) {
    if (elements.feedback) {
      elements.feedback.classList.remove('hidden');
      elements.feedback.classList.remove('correct', 'incorrect');
      elements.feedback.textContent = 'Please type an answer before submitting.';
    }
    if (elements.feedbackRow) {
      elements.feedbackRow.classList.remove('hidden');
    }
    if (elements.answerPronunciationButton) {
      elements.answerPronunciationButton.classList.add('hidden');
    }
    return;
  }

  const userAnswer = normalizeText(elements.answerInput.value);
  const isCorrect = state.currentQuestion.validAnswers.some(
    (validAnswer) => normalizeText(validAnswer) === userAnswer
  );

  state.isAnswered = true;
  if (elements.answerInput) {
    elements.answerInput.disabled = true;
  }
  if (elements.submitAnswerButton) {
    elements.submitAnswerButton.classList.add('hidden');
  }
  if (elements.feedbackRow) {
    elements.feedbackRow.classList.remove('hidden');
  }

  if (isCorrect) {
    state.score += 1;
    state.correctAnswers += 1;
    if (elements.feedback) {
      elements.feedback.classList.remove('hidden');
      elements.feedback.classList.add('correct');
      elements.feedback.classList.remove('incorrect');
      elements.feedback.textContent = `Correct! ${state.currentQuestion.verb.infinitive} in ${state.currentQuestion.tense} for ${state.currentQuestion.person.italian} is "${state.currentQuestion.fullAnswer}".`;
    }
    if (elements.scorePill) {
      elements.scorePill.textContent = String(state.score);
    }
    if (elements.showConjugationButton) {
      elements.showConjugationButton.classList.add('hidden');
    }
    if (elements.conjugationSheet) {
      elements.conjugationSheet.classList.add('hidden');
      elements.conjugationSheet.innerHTML = '';
    }
  } else {
    state.incorrectAnswers += 1;
    if (elements.feedback) {
      elements.feedback.classList.remove('hidden');
      elements.feedback.classList.add('incorrect');
      elements.feedback.classList.remove('correct');
      const correctAnswersText = state.currentQuestion.validAnswers
        .map((answer) => `  • ${answer}`)
        .join('\n');
      elements.feedback.textContent = `❌ Incorrect.\nCorrect answers:\n${correctAnswersText}`;
    }
    if (elements.showConjugationButton) {
      elements.showConjugationButton.classList.remove('hidden');
    }
  }

  if (elements.answerPronunciationButton) {
    if (canUseSpeechSynthesis()) {
      elements.answerPronunciationButton.classList.remove('hidden');
      elements.answerPronunciationButton.disabled = false;
      speakCurrentAnswer();
    } else {
      elements.answerPronunciationButton.classList.add('hidden');
    }
  }

  if (elements.nextQuestionButton) {
    elements.nextQuestionButton.classList.remove('hidden');
  }
}

function moveToNextQuestion() {
  state.currentQuestionIndex += 1;

  if (state.currentQuestionIndex >= state.quizQuestions.length) {
    showResults();
    return;
  }

  renderQuestion();
}

function showResults() {
  const totalQuestions = getQuizTotal();
  const percentage = Math.round((state.score / totalQuestions) * 100);

  elements.finalScore.textContent = String(state.score);
  if (elements.finalTotal) {
    elements.finalTotal.textContent = String(totalQuestions);
  }
  elements.finalPercentage.textContent = `${percentage}%`;
  elements.correctCount.textContent = String(state.correctAnswers);
  elements.incorrectCount.textContent = String(state.incorrectAnswers);
  showScreen('results');
}

function startExercise() {
  const selectedVerbs = getSelectedVerbIds();
  const selectedTenses = getSelectedTenses();

  if (selectedVerbs.length === 0 || selectedTenses.length === 0 || !state.selectedQuestionCount) {
    return;
  }

  state.quizTotal = state.selectedQuestionCount;
  resetQuizState();
  state.quizQuestions = buildQuizQuestions({
    questionCount: state.selectedQuestionCount,
    selectedVerbIds: selectedVerbs,
    selectedTenses,
  });

  if (!state.quizQuestions.length) {
    return;
  }

  showScreen('quiz');
  renderQuestion();
}

function resetExerciseConfig() {
  state.selectedVerbIds.clear();
  state.selectedTenseNames.clear();
  state.selectedQuestionCount = 20;
  state.quizTotal = state.selectedQuestionCount;

  verbGroups.forEach((group) => {
    group.verbs.forEach((verb) => state.selectedVerbIds.add(verb.infinitive));
  });
  allTenses.forEach((tense) => state.selectedTenseNames.add(tense));

  renderVerbSelection();
  renderTenseSelection();
  renderQuestionCountSelection();
  updateStartButtonState();
}

function renderStudyScreen() {
  if (!elements.studyVerbSelect || !elements.studyTenseSelect || !elements.studyConjugationCard) return;

  const sortedVerbs = [...verbData].sort((a, b) => a.infinitive.localeCompare(b.infinitive, 'fr'));
  const verbOptions = sortedVerbs
    .map((verb) => `<option value="${verb.infinitive}">${verb.infinitive}</option>`)
    .join('');

  elements.studyVerbSelect.innerHTML = verbOptions;
  elements.studyVerbSelect.value = state.studyVerb;

  const tenseOptions = allTenses
    .map((tense) => `<option value="${tense}">${tense}</option>`)
    .join('');

  elements.studyTenseSelect.innerHTML = tenseOptions;
  elements.studyTenseSelect.value = state.studyTense;

  const studyCard = getStudyCardData(state.studyVerb, state.studyTense);
  if (!studyCard) {
    elements.studyConjugationCard.innerHTML = '<div class="study-empty">Coniugazione non disponibile.</div>';
    return;
  }

  const tableRows = studyCard.rows.length
    ? studyCard.rows.map((row) => `
      <tr>
        <th>${row.label}</th>
        <td>${row.value}</td>
      </tr>
    `).join('')
    : '<tr><td colspan="2">Coniugazione non disponibile.</td></tr>';

  elements.studyConjugationCard.innerHTML = `
    <div class="study-header">
      <div>
        <p class="study-label">${studyCard.infinitive}</p>
        <h3>${studyCard.infinitive}</h3>
      </div>
      <span class="study-translation">${studyCard.italian}</span>
    </div>
    <div class="study-tense">${studyCard.tense}</div>
    <table class="conjugation-table study-table">
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
}

if (typeof module !== 'undefined') {
  module.exports = {
    getCategories,
    getCategoryVerbIds,
    getSelectedVerbIds,
    getSelectedTenses,
    getQuestionCount,
    getQuizTotal,
    getConjugationRows,
    getStudyCardData,
    buildConjugationTableMarkup,
    startsWithVowelOrH,
    buildValidAnswers,
    buildFullFrenchAnswer,
    getPreferredFrenchVoice,
    createFrenchSpeechUtterance,
    canUseSpeechSynthesis,
    speakCurrentAnswer,
    setQuestionCount,
    setSelectedVerbs,
    setSelectedTenses,
    buildQuizQuestions,
    getVerbIdsByCategory,
    toggleCategory,
    toggleVerb,
    getCategorySelectionState,
    resetExerciseConfig,
  };
}

initializeExerciseConfig();

if (typeof document !== 'undefined') {
  if (elements.startExerciseButton) {
    elements.startExerciseButton.addEventListener('click', startExercise);
  }
  if (elements.openStudyScreenButton) {
    elements.openStudyScreenButton.addEventListener('click', () => {
      renderStudyScreen();
      showScreen('study');
    });
  }
  if (elements.studyBackButton) {
    elements.studyBackButton.addEventListener('click', () => {
      showScreen('home');
    });
  }

  if (elements.studyVerbSelect) {
    elements.studyVerbSelect.addEventListener('change', (event) => {
      state.studyVerb = event.target.value;
      renderStudyScreen();
    });
  }

  if (elements.studyTenseSelect) {
    elements.studyTenseSelect.addEventListener('change', (event) => {
      state.studyTense = event.target.value;
      renderStudyScreen();
    });
  }

  if (elements.submitAnswerButton) {
    elements.submitAnswerButton.addEventListener('click', () => {
      if (!state.isAnswered) {
        checkAnswer();
      }
    });
  }

  if (elements.answerPronunciationButton) {
    elements.answerPronunciationButton.addEventListener('click', () => {
      if (canUseSpeechSynthesis()) {
        speakCurrentAnswer({ force: true });
      }
    });
  }

  if (elements.showConjugationButton) {
    elements.showConjugationButton.addEventListener('click', () => {
      if (!state.currentQuestion) return;
      elements.showConjugationButton.classList.add('hidden');
      renderConjugationSheet(state.currentQuestion.verb.infinitive, state.currentQuestion.tense, state.currentQuestion.person.key);
    });
  }

  if (elements.answerInput) {
    elements.answerInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !state.isAnswered) {
        checkAnswer();
      }
    });
  }

  if (elements.nextQuestionButton) {
    elements.nextQuestionButton.addEventListener('click', () => {
      moveToNextQuestion();
    });
  }

  if (elements.backToHomeButton) {
    elements.backToHomeButton.addEventListener('click', () => {
      resetQuizState();
      showScreen('home');
      if (elements.answerInput) {
        elements.answerInput.value = '';
      }
      if (elements.feedback) {
        elements.feedback.classList.add('hidden');
      }
      if (elements.nextQuestionButton) {
        elements.nextQuestionButton.classList.add('hidden');
      }
      if (elements.submitAnswerButton) {
        elements.submitAnswerButton.classList.remove('hidden');
      }
      if (elements.scorePill) {
        elements.scorePill.textContent = '0';
      }
    });
  }

  if (elements.newExerciseButton) {
    elements.newExerciseButton.addEventListener('click', () => {
      resetQuizState();
      showScreen('home');
      if (elements.answerInput) {
        elements.answerInput.value = '';
      }
      if (elements.feedback) {
        elements.feedback.classList.add('hidden');
      }
      if (elements.nextQuestionButton) {
        elements.nextQuestionButton.classList.add('hidden');
      }
      if (elements.submitAnswerButton) {
        elements.submitAnswerButton.classList.remove('hidden');
      }
      if (elements.scorePill) {
        elements.scorePill.textContent = '0';
      }
    });
  }

  renderStudyScreen();
  showScreen('home');
}
