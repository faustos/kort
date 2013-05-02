//$$$ replaced by mission
/**
 * Model for a bug
 */
function determineMissionState(v, record) {
    return record.data.campaign_id ? Kort.util.Config.getMissionState().bugCampaign : Kort.util.Config.getMissionState().bug;
}

Ext.define('Kort.model.Bug', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'schema', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'osm_id', type: 'int' },
			{ name: 'osm_type', type: 'string' },
			{ name: 'title', type: 'string' },
			{ name: 'description', type: 'string' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
            { name: 'view_type', type: 'string' },
            { name: 'answer_placeholder', type: 'string' },
            { name: 'fix_koin_count', type: 'int' },
            { name: 'campaign_id', type: 'int' },
            { name: 'campaign_extra_coins', type: 'int' },
            { name: 'state', convert:determineMissionState}
        ]
    }
});