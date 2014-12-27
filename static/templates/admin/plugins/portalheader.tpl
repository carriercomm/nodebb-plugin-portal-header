<div class="container">
  <div class="col-md-4 col-xs-12 pull-right">

    <div class="panel panel-body">
      <div class="panel-heading"><span class="panel-title">
        HEADER EDITOR
      </span>
        <button class="btn btn-warning btn-xs pull-right" id="new">New</button>
      </div>
      <form id="header-edit-forum">
        <div class="input-group">
          <label> Display Title </label>
          <input type="text" class="form-control" name="header-title" />
        </div>
        <div class="input-group">
          <label> Style Class <p>option class:
            <br /><small>'show-title': show title always</small>
            <br /><small>'force': override a header same href</small>
            <br /><small>'cpanel': show at user-cpanel</small>
            <br /><small>'cpanel-only': disable at forum paths</small>
          </p></label>
          <input type="text" class="form-control" name="header-class" />
        </div>
        <div class="input-group">
          <label> Display Text </label>
          <input type="text" class="form-control" name="header-text" />
        </div>
        <div class="input-group">
          <label> Display Text Class </label>
          <input type="text" class="form-control" name="header-textClass" />
        </div>
        <div class="input-group">
          <label> Display Icon Class </label>
          <input type="text" class="form-control" name="header-iconClass" />
        </div>
        <div class="input-group">
          <label> Route (url) </label>
          <input type="text" class="form-control" name="header-route" />
        </div>
        <input type="hidden" class="form-control" name="header-idx" />
        <br/>
        <div class="input-group">
          <button class="btn btn-primary" id="save">Save</button>
        </div>
      </form>
    </div>

  </div>

  <div class=" col-md-8 col-xs-12 pull-left">

    <div class="panel panel-body">
      <label class="panel-heading">HEADER LIST</label>
      <!-- IF !headers.length -->
      <div class='alert alert-warning'>
        <strong>Does not have any headers yet!</strong>
      </div>
      <!-- ENDIF !headers.length -->
      <table class='table table-condensed'>
        <thead class="header-title">
          <tr>
            <th>#</th>
            <th>title</th>
            <th>class</th>
            <th>text</th>
            <th>textClass</th>
            <th>iconClass</th>
            <th>route</th>
          </tr>
        </thead>
        <tbody class="header-list">
          <!-- BEGIN headers -->
          <tr>
            <td><button class='header-up button button-info'><span class='fa fa-arrow-up '></span></button><button class='header-down button button-info'><span class='fa fa-arrow-down '></span></button> <a href='#' class='header-remove'><span class='fa fa-trash-o' style="color:red;"></span></a> </td>
            <td>{headers.title}</td>
            <td>{headers.class}</td>
            <td>{headers.text}</td>
            <td>{headers.textClass}</td>
            <td>{headers.iconClass}</td>
            <td>{headers.route}</td>
          </tr>
          <!-- END headers -->
        </tbody>
      </table>
    </div>
  </div>
</div>

</div>

<script>
  (function() {
    updateSelected();
    function save(settings){
      socket.emit('admin.plugins.portalheader.saveSettings', {headers:JSON.stringify(settings.headers)}, function(err, result) {
        if (err) {
          app.alertError(err.message);
        } else {
          app.alertSuccess('Successfully Save Header!');
        }
        ajaxify.go('admin/plugins/portalheader');
      });
    }
    function updateSelected(){
      var idx = $('#header-edit-forum [name="header-idx"]').val();
      $( "tbody > tr:even" ).css( "background-color", "#eee" );
      $( "tbody > tr:odd" ).css( "background-color", "" );
      if(idx){
        $('tbody.header-list tr:eq('+idx+')').css('background-color',"#cfc");
      }
      $('tbody.header-list').find('tr .header-up,tr .header-down').show();
      $('tbody.header-list').find('tr:first-child .header-up,tr:last-child .header-down').hide();
    }
    function getSettings() {
      var result = {
        headers: []
      };
      var th = $('thead.header-title tr > th:gt(0)');
      $('tbody.header-list tr').each(function(){
        var data = {};
        $(this).find('td:gt(0)').each(function(){
          data[$(th[$(this).index()-1]).text()] = $(this).text();
        });
        result.headers[$(this).index()] = data;
      });
      return result;
    }

    $('#save').on('click', function() {
      var settings = getSettings();
      var data = {};
      $('#header-edit-forum input').each(function() {
        var $this = $(this);
        data[$this.attr('name').replace('header-', '')] = $this.val();
      });
      if (data.idx) {
        settings.headers[data.idx] = data;
      } else {
        settings.headers.push(data);
      }
      delete data['idx'];
      save(settings);
      return false;
    });

    $('#new').on('click', function() {
      $('#header-edit-forum input').val('');
      updateSelected();
      return false;
    });

    $('.header-up').on('click',function(){
      var idx = $(this).parent().parent().index();
      if(idx > 0){
        $('tbody.header-list > tr:eq('+idx+')').insertBefore(  $('tbody.header-list > tr:eq('+(idx-1)+')'));
        updateSelected();
        save(getSettings());
      }
      return false;
    });
    $('.header-down').on('click',function(){
      var idx = $(this).parent().parent().index();
      if(idx < $('tbody.header-list > tr').length-1){
        $('tbody.header-list > tr:eq('+(idx+1)+')').insertBefore(  $('tbody.header-list > tr:eq('+idx+')'));
        updateSelected();
        save(getSettings());
      }
      return false;
    });
    $('.header-remove').on('click', function(){
      var idx = $(this).parent().parent().index();
      bootbox.confirm('Do you want to delete the selected header?', function (confirm) {
        if (!confirm) {
          return;
        }
        $('.header-list tr:eq('+idx+')').remove();
        save(getSettings());
      });
      return false;
    });
    $('tbody.header-list > tr').on('click', function(){
      var idx = $(this).index();
      $('#header-edit-forum [name="header-idx"]').val(idx)
      $('.header-list tr:eq('+idx+') td').each(function(){
        if($(this).index()){
          var prop = $('thead.header-title tr th:eq('+$(this).index()+')').text();
          $('#header-edit-forum [name="header-'+prop+'"]').val($(this).text());
        }
      });
      $('#header-edit-forum [name="header-title"]').focus();
      updateSelected();
      return false;
    });
  }());
</script>
